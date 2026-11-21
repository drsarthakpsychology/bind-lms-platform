import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, Check, CircleHelp, Flag, FileCheck, MessageCircleQuestion, Trophy, Video } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Field, IconDot, Row, RowsSkeleton, Sheet, T } from "@/ds";
import { toast } from "@/ds/toast";
import { haptic } from "@/lib/haptics";
import { config } from "@/lib/config";
import { openLink } from "@/lib/open";
import { createStore } from "@/lib/store";
import { Enter, LoadSwap, Press } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { SmallButton, Status } from "../kit";
import { plural } from "../format";
import { EmptyState, Group, Locked, MockNote, Panel, Screen, ShareBar, Tiles, useSample } from "../ui";
import { MODULES, PRACTICE_SETS, type KeyQuestion, type TeachModule, type TeachSection } from "./mock";

/**
 * Teaching is the reviewer's view of what students study and practise. It is
 * not the student screen: no Continue, no progress ring, no points, no hints.
 * Every answer and its reason is on the page, with how the class did, and a
 * way to flag anything that needs correcting. Nothing here is saved as the
 * admin's own progress.
 */

/** Flags and review marks made in this sitting (sample data: kept on the phone only). */
const review = createStore<{ flags: Record<string, string | null>; reviewed: Record<string, string> }>({ flags: {}, reviewed: {} });
const flagOf = (q: KeyQuestion, flags: Record<string, string | null>) => (q.id in flags ? flags[q.id] ?? null : q.flagged);
const reviewedOf = (q: KeyQuestion, done: Record<string, string>) => done[q.id] ?? q.reviewed;
const allQuestions = () => [...MODULES.flatMap((m) => m.sections.flatMap((s) => s.questions)), ...PRACTICE_SETS.flatMap((p) => p.questions)];

function useReviewCounts() {
  const flags = review.use((s) => s.flags);
  const done = review.use((s) => s.reviewed);
  const qs = allQuestions();
  return { flagged: qs.filter((q) => flagOf(q, flags)).length, unreviewed: qs.filter((q) => !reviewedOf(q, done)).length, total: qs.length };
}

const pctOf = (a: number, b: number) => Math.round((a / Math.max(1, b)) * 100);

/* ------------------------------------------------------------------ hub */

function ModuleCard({ m, i }: { m: TeachModule; i: number }) {
  const flags = review.use((s) => s.flags);
  const flagged = m.sections.flatMap((s) => s.questions).filter((q) => flagOf(q, flags)).length;
  const scores = m.sections.filter((s) => s.score !== null).map((s) => s.score!);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  return (
    <Enter i={i}>
      <Press testID={`teach-${m.id}`} accessibilityRole="button" accessibilityLabel={`${m.title}. ${m.finishedAll} of ${m.students} finished. Open class results`} onPress={() => router.push(`/admin/teaching/${m.id}`)} scale={0.98}>
        <Panel style={{ gap: space[2] }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: space[2] }}>
            <T v="bodyStrong" style={{ flex: 1 }}>
              {m.title}
            </T>
            {flagged ? <Status tone="warn">{flagged} flagged</Status> : m.reviewedOn ? <Status tone="ok">Reviewed</Status> : <Status tone="quiet">Not reviewed</Status>}
          </View>
          <ShareBar pct={pctOf(m.finishedAll, m.students)} label={`${m.finishedAll} of ${m.students} finished`} />
          <T v="small" tone="muted" num>
            {m.finishedAll} of {m.students} finished · {plural(m.sections.length, "section")}
            {avg !== null ? ` · checkpoints ${avg}%` : ""}
          </T>
        </Panel>
      </Press>
    </Enter>
  );
}

export function TeachingScreen() {
  const sample = useSample(MODULES);
  const n = useReviewCounts();
  return (
    <Screen tab title="Teaching" lead="Reviewer view: answers shown, nothing saved" testID="admin-teaching">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[5] }}>
          <Tiles
            items={[
              { value: MODULES.length, label: "study modules" },
              { value: n.flagged, label: "flagged for review", tone: "warn" },
              { value: n.unreviewed, label: `of ${n.total} not reviewed` },
            ]}
          />
          <Group title="Study modules" count={MODULES.length}>
            {MODULES.map((m, i) => (
              <ModuleCard key={m.id} m={m} i={i} />
            ))}
          </Group>
          <Group title="Practice content" count={PRACTICE_SETS.length}>
            <Panel rows>
              {PRACTICE_SETS.map((p) => (
                <Row key={p.id} testID={`teach-${p.id}`} title={p.title} meta={`${p.kind} · ${p.attempts} tries · hardest: ${p.hardest}`} trailing={`${p.score}%`} onPress={() => router.push(`/admin/teaching/practice/${p.id}`)} />
              ))}
            </Panel>
          </Group>
          <Group title="Student work">
            <Panel rows>
              <Row title="Doubts and concerns" meta="Questions waiting for an answer" icon={<IconDot icon={MessageCircleQuestion} />} onPress={() => router.push("/admin/doubts")} testID="teach-doubts" />
              <Row title="Hand-ins and sign-offs" meta="Grade, return, sign" icon={<IconDot icon={FileCheck} />} onPress={() => router.push("/admin/review")} testID="teach-review" />
              <Row title="Leaderboard" meta="Every student, any cohort" icon={<IconDot icon={Trophy} />} onPress={() => router.push("/admin/leaderboard")} testID="teach-board" />
              <Row title="Learning insights" meta="What the class finds hard" icon={<IconDot icon={CircleHelp} />} onPress={() => router.push("/admin/insights")} testID="teach-insights" />
            </Panel>
          </Group>
          <Group title="Lectures">
            <Panel rows>
              <Row title="Courses and lectures" meta="Uploading and editing stays on the website" icon={<IconDot icon={Video} />} onPress={() => void openLink(`${config.site}/admin/courses`)} testID="teach-courses" />
            </Panel>
          </Group>
          <MockNote what="Teaching" />
        </View>
      </LoadSwap>
    </Screen>
  );
}

/* --------------------------------------------------------------- module */

/** One module: how the class did on each section. Checkpoints show the score; a tap opens the answer key. */
export function TeachingModuleScreen() {
  const id = String(useLocalSearchParams<{ module: string }>().module ?? "");
  const m = MODULES.find((x) => x.id === id);
  const sample = useSample(m);
  const flags = review.use((s) => s.flags);
  if (!m)
    return (
      <Screen title="Module" testID="admin-teach-module">
        <EmptyState title="This module could not be found" body="It may have been renamed." action={{ label: "Back to Teaching", onPress: () => router.replace("/admin/teaching") }} />
      </Screen>
    );
  const qs = m.sections.flatMap((s) => s.questions);
  const hardest = [...qs].sort((a, b) => a.rightPct - b.rightPct)[0];
  const hardSection = hardest ? m.sections.find((s) => s.questions.includes(hardest)) : undefined;
  return (
    <Screen title={m.title} lead={`${m.students} students · ${m.reviewedOn ? `reviewed ${m.reviewedOn}` : "not reviewed yet"}`} testID="admin-teach-module">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[5] }}>
          <Tiles
            items={[
              { value: pctOf(m.finishedAll, m.students), suffix: "%", label: "finished it all" },
              { value: m.sections.reduce((n, s) => n + s.avgMinutes, 0), label: "minutes, on average" },
              { value: qs.filter((q) => flagOf(q, flags)).length, label: "flagged", tone: "warn" },
            ]}
          />
          {hardest && hardSection ? (
            <Group title="Most got wrong">
              <Press accessibilityRole="button" accessibilityLabel={`Hardest question, ${hardest.rightPct} percent right. Open the answer key`} onPress={() => router.push(`/admin/teaching/section/${hardSection.id}`)} scale={0.98} testID="teach-hardest">
                <Panel style={{ gap: space[2] }}>
                  <T v="small">{hardest.q}</T>
                  <ShareBar pct={hardest.rightPct} tone="warn" label={`${hardest.rightPct} percent right first try`} />
                  <T v="caption" tone="muted">
                    Right at the first try · {hardSection.title}
                  </T>
                </Panel>
              </Press>
            </Group>
          ) : null}
          <Group title="Class results by section" count={m.sections.length}>
            <Panel rows>
              {m.sections.map((s, i) => {
                const f = s.questions.filter((q) => flagOf(q, flags)).length;
                return (
                  <Row
                    key={s.id}
                    testID={`teach-${s.id}`}
                    title={s.title}
                    meta={`${s.finished} of ${m.students} finished · ${s.avgMinutes} min${f ? ` · ${f} flagged` : ""}`}
                    icon={
                      <T v="caption" tone="muted" num style={{ minWidth: 20, textAlign: "center" }}>
                        {i + 1}
                      </T>
                    }
                    trailing={s.score !== null ? `${s.score}%` : undefined}
                    below={
                      <View style={{ paddingTop: space[1] }}>
                        <ShareBar pct={pctOf(s.finished, m.students)} label={`${s.finished} of ${m.students} finished`} />
                      </View>
                    }
                    onPress={() => router.push(`/admin/teaching/section/${s.id}`)}
                  />
                );
              })}
            </Panel>
          </Group>
          <MockNote what="Class results" />
        </View>
      </LoadSwap>
    </Screen>
  );
}

/* ----------------------------------------------------------- answer key */

/**
 * One question as a reviewer needs it: the full question, every option with
 * the correct one marked in words, the option most students fell for, the
 * explanation, how the class did, and the review controls.
 */
function KeyCard({ q, n, onFlag }: { q: KeyQuestion; n: number; onFlag: (q: KeyQuestion) => void }) {
  const c = useTheme();
  const flags = review.use((s) => s.flags);
  const done = review.use((s) => s.reviewed);
  const flag = flagOf(q, flags);
  const reviewed = reviewedOf(q, done);
  return (
    <Panel testID={`key-${q.id}`} style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[2] }}>
        <T v="label" tone="muted">
          Question {n}
        </T>
        {flag ? <Status tone="warn">Flagged</Status> : reviewed ? <Status tone="ok">Reviewed {reviewed}</Status> : <Status tone="quiet">Not reviewed</Status>}
      </View>
      <T v="bodyStrong">{q.q}</T>
      <View style={{ gap: space[2] }}>
        {q.options.map((o, i) => {
          const right = i === q.answer;
          const trap = i === q.trap && !right;
          return (
            <View key={i} accessible accessibilityLabel={`${o}${right ? ". Correct answer" : trap ? ". Most picked wrong answer" : ""}`} style={{ flexDirection: "row", gap: space[2], alignItems: "flex-start", borderRadius: 14, paddingHorizontal: space[3], paddingVertical: space[2], backgroundColor: right ? c.ink : c.bg }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, marginTop: 1, alignItems: "center", justifyContent: "center", backgroundColor: right ? c.lime : "transparent", borderWidth: right ? 0 : 1.5, borderColor: c.hairline }}>{right ? <Check size={13} color={c.onLime} strokeWidth={3} /> : null}</View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <T v="small" tone={right ? "onInk" : "ink"}>
                  {o}
                </T>
                {right ? (
                  <T v="caption" tone="onInk" style={{ opacity: 0.8 }}>
                    Correct answer
                  </T>
                ) : trap ? (
                  <T v="caption" tone="muted">
                    Most picked wrong answer
                  </T>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ gap: 2 }}>
        <T v="label" tone="muted">
          Why
        </T>
        <T v="small">{q.why}</T>
      </View>
      <View style={{ gap: 4 }}>
        <ShareBar pct={q.rightPct} tone={q.rightPct < 60 ? "warn" : "plain"} label={`${q.rightPct} percent of the class right first try`} />
        <T v="caption" tone="muted">
          Of the class, right at the first try
        </T>
      </View>
      {flag ? (
        <View style={{ borderRadius: 14, backgroundColor: c.warnBg, padding: space[3], gap: 2 }}>
          <T v="caption" style={{ color: c.warnFg }}>
            Flagged for review
          </T>
          <T v="small" style={{ color: c.warnFg }}>
            {flag}
          </T>
        </View>
      ) : null}
      <Locked>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {flag ? (
            <SmallButton
              label="Clear flag"
              testID={`key-${q.id}-clear`}
              onPress={() => {
                review.set((s) => ({ flags: { ...s.flags, [q.id]: null } }));
                toast.show("Flag cleared");
              }}
            />
          ) : (
            <SmallButton label="Flag for review" icon={<Flag size={16} color={c.ink} />} onPress={() => onFlag(q)} testID={`key-${q.id}-flag`} />
          )}
          <SmallButton
            label={reviewed ? "Mark reviewed again" : "Mark reviewed"}
            testID={`key-${q.id}-reviewed`}
            onPress={() => {
              review.set((s) => ({ reviewed: { ...s.reviewed, [q.id]: "today" } }));
              haptic.success();
              toast.show("Marked as reviewed");
            }}
          />
        </View>
      </Locked>
    </Panel>
  );
}

/** The note that goes with a flag: what is wrong, in the reviewer's words. */
function FlagSheet({ q, onClose }: { q: KeyQuestion | null; onClose: () => void }) {
  const [text, setText] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  return (
    <Sheet open={!!q} onClose={onClose} title="Flag for review" testID="flag-sheet">
      <View style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          Students keep seeing the question until it is corrected on the website. The flag shows here and on the module.
        </T>
        <Field label="What needs correcting" value={text} onChangeText={setText} area error={err} maxLength={400} placeholder="For example: two options could both be right" testID="flag-note" />
        <Button
          label="Flag it"
          testID="flag-save"
          onPress={() => {
            if (!text.trim()) return setErr("Write one line about what is wrong.");
            if (q) review.set((s) => ({ flags: { ...s.flags, [q.id]: text.trim() } }));
            setText("");
            setErr(null);
            haptic.success();
            toast.show("Flagged for review");
            onClose();
          }}
        />
        <Button kind="text" full label="Cancel" onPress={onClose} />
      </View>
    </Sheet>
  );
}

function KeyList({ questions }: { questions: KeyQuestion[] }) {
  const [flagging, setFlagging] = React.useState<KeyQuestion | null>(null);
  return (
    <>
      {questions.map((q, i) => (
        <Enter key={q.id} i={i}>
          <KeyCard q={q} n={i + 1} onFlag={setFlagging} />
        </Enter>
      ))}
      <FlagSheet q={flagging} onClose={() => setFlagging(null)} />
    </>
  );
}

function findSection(id: string): { m: TeachModule; s: TeachSection } | null {
  for (const m of MODULES) {
    const s = m.sections.find((x) => x.id === id);
    if (s) return { m, s };
  }
  return null;
}

/** A section as the reviewer sees it: the class numbers, then the reading or the full answer key. */
export function AnswerKeyScreen() {
  const c = useTheme();
  const id = String(useLocalSearchParams<{ id: string }>().id ?? "");
  const found = findSection(id);
  const sample = useSample(found);
  if (!found)
    return (
      <Screen title="Section" testID="admin-answer-key">
        <EmptyState title="This section could not be found" action={{ label: "Back to Teaching", onPress: () => router.replace("/admin/teaching") }} />
      </Screen>
    );
  const { m, s } = found;
  const i = m.sections.indexOf(s);
  const prev = m.sections[i - 1];
  const next = m.sections[i + 1];
  return (
    <Screen title={s.title} lead={`${m.title} · ${s.kind === "checkpoint" ? "answer key" : "reading"}`} testID="admin-answer-key">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[4] }}>
          <Tiles
            items={[
              { value: s.finished, label: `of ${m.students} finished` },
              { value: s.avgMinutes, label: "minutes, on average" },
              ...(s.score !== null ? [{ value: s.score, suffix: "%", label: "first try score", tone: s.score < 60 ? ("warn" as const) : ("plain" as const) }] : []),
            ]}
            per={s.score !== null ? 3 : 2}
          />
          {s.kind === "reading" ? (
            <Group title="What students read">
              <Panel style={{ gap: space[3] }}>
                <View style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
                  <BookOpen size={16} color={c.muted} />
                  <T v="caption" tone="muted">
                    Opening lines. The whole text is on the website.
                  </T>
                </View>
                <T v="reading" style={{ maxWidth: layout.readingWidth }}>
                  {s.summary}
                </T>
                <SmallButton label="Open the full text on the website" onPress={() => void openLink(`${config.site}/study/${m.id}/${s.id.split(".")[1] ?? ""}`)} testID="key-open-web" />
              </Panel>
            </Group>
          ) : (
            <Group title="Answer key" count={s.questions.length}>
              <KeyList questions={s.questions} />
            </Group>
          )}
          <View style={{ flexDirection: "row", gap: space[2] }}>
            <View style={{ flex: 1 }}>{prev ? <Button small kind="quiet" label="Earlier section" onPress={() => router.replace(`/admin/teaching/section/${prev.id}`)} testID="key-prev" /> : null}</View>
            <View style={{ flex: 1 }}>{next ? <Button small kind="quiet" label="Next section" onPress={() => router.replace(`/admin/teaching/section/${next.id}`)} testID="key-next" /> : null}</View>
          </View>
          <MockNote what="The answer key" />
        </View>
      </LoadSwap>
    </Screen>
  );
}

/** A practice set, a game's question bank or a mock, as a reviewer: results first, then the key. */
export function PracticeSetScreen() {
  const id = String(useLocalSearchParams<{ id: string }>().id ?? "");
  const p = PRACTICE_SETS.find((x) => x.id === id);
  const sample = useSample(p);
  if (!p)
    return (
      <Screen title="Practice" testID="admin-practice-set">
        <EmptyState title="This set could not be found" action={{ label: "Back to Teaching", onPress: () => router.replace("/admin/teaching") }} />
      </Screen>
    );
  return (
    <Screen title={p.title} lead={`${p.kind} · answer key`} testID="admin-practice-set">
      <LoadSwap ready={sample.ready} skeleton={<RowsSkeleton rows={6} />}>
        <View style={{ gap: space[4] }}>
          <Tiles
            per={2}
            items={[
              { value: p.attempts, label: "tries this month" },
              { value: p.score, suffix: "%", label: "average score", tone: p.score < 60 ? "warn" : "plain" },
            ]}
          />
          <Panel style={{ gap: 2 }}>
            <T v="caption" tone="muted">
              Hardest for the class
            </T>
            <T v="small">{p.hardest}</T>
          </Panel>
          <Group title="Answer key" count={p.questions.length}>
            <KeyList questions={p.questions} />
          </Group>
          <T v="caption" tone="muted" style={{ paddingHorizontal: space[1] }}>
            A sample of the set. To play it the way a student does, use Test mode in More.
          </T>
          <MockNote what="The answer key" />
        </View>
      </LoadSwap>
    </Screen>
  );
}
