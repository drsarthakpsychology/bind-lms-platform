import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, ListChecks, Scale, TriangleAlert } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Label, Loaded, QuietEmpty, Row, RowList, Skeleton, Stone, T } from "@/ds";
import { IconPatch, Page, Tag } from "@/lab/shell";
import { QuestionRun, type RunResult, type Step } from "@/lab/run";
import { Enter, StaggerList } from "@/motion";
import { noteAnswers, useTool } from "@/practise/api";
import { space, useTheme } from "@/theme";

/**
 * Ethics, law and referral (switched on for students on the website). Real
 * data: GET /practise/tools/ethics gives the day's three dilemmas and the
 * quick check, the same ones the website shows today. Decide first, then see
 * what happens and what the law says. Answers go into the answer history the
 * same way the older case tool sent them.
 */
export type Dilemma = { id: string; tag: string; setting: string; vignette: string; options: { label: string; consequence: string; correct: boolean }[]; law: string };
export type QuizItem = { id: string; prompt: string; options: string[]; correct: number; rationale: string };

const list = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);

export function dilemmaSteps(d: Dilemma): Step[] {
  return [{ id: d.id, context: d.vignette, contextLabel: d.setting, prompt: "What do you do?", options: d.options.map((o) => o.label), answer: Math.max(0, d.options.findIndex((o) => o.correct)), notes: d.options.map((o) => o.consequence), more: { label: "What the law says", text: d.law } }];
}
export function quizSteps(q: QuizItem[]): Step[] {
  return q.map((x) => ({ id: x.id, prompt: x.prompt, options: x.options, answer: x.correct, why: x.rationale }));
}

function HomeSkeleton() {
  return (
    <View style={{ gap: space[3] }}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} h={132} r={26} />
      ))}
    </View>
  );
}

export function EthicsHomeScreen() {
  const c = useTheme();
  const q = useTool("ethics");
  return (
    <Page testID="ethics-home" home="/practise" title="Ethics, law and referral" lead="Decide first. Then see what happens, and what the law says." area="practise" onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <Loaded q={q} what="today's dilemmas" skeleton={<HomeSkeleton />}>
        {(d) => {
          const dilemmas = list<Dilemma>(d.data.dilemmas);
          const quiz = list<QuizItem>(d.data.quiz);
          return (
            <>
              <View style={{ gap: space[2] }}>
                <Label>Today's dilemmas</Label>
                {dilemmas.length ? (
                  <StaggerList style={{ gap: space[3] }}>
                    {dilemmas.map((x) => (
                      <Stone key={x.id} testID={`dilemma-${x.id}`} accessibilityLabel={`${x.tag}. ${x.setting}`} grow={() => router.push(`/ethics/${encodeURIComponent(x.id)}`)}>
                        <View style={{ gap: space[2] }}>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[2] }}>
                            <Tag>{x.tag}</Tag>
                            <ArrowRight size={18} color={c.muted} />
                          </View>
                          <T v="h2">{x.setting}</T>
                          <T v="small" tone="muted" numberOfLines={2}>
                            {x.vignette}
                          </T>
                        </View>
                      </Stone>
                    ))}
                  </StaggerList>
                ) : (
                  <QuietEmpty testID="ethics-empty" title="No dilemmas today" body="New ones arrive every day. The quick check is below." />
                )}
              </View>
              <Enter i={3}>
                <View style={{ gap: space[2] }}>
                  <Label>Also here</Label>
                  <RowList bare>
                    {quiz.length ? <Row testID="ethics-quiz" title="Quick check" meta={`${quiz.length} questions on law and referral`} icon={<IconPatch icon={ListChecks} size={40} />} onPress={() => router.push("/ethics/quiz")} chevron /> : null}
                    <Row testID="ethics-depth" title="Out of depth" meta="When to refer, escalate or stop" icon={<IconPatch icon={TriangleAlert} size={40} />} onPress={() => router.push("/case/out-of-depth")} chevron />
                  </RowList>
                </View>
              </Enter>
            </>
          );
        }}
      </Loaded>
    </Page>
  );
}

/** /ethics/:id is one dilemma; /ethics/quiz is the quick check. */
export function EthicsRunScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const q = useTool("ethics");
  const send = React.useCallback((r: RunResult[]) => noteAnswers("ethics", r.map((x) => ({ item: x.id, correct: x.right }))), []);
  if (!q.data)
    return (
      <Page testID="ethics-loading" home="/ethics" title="Ethics, law and referral">
        <Loaded q={q} what="this dilemma" skeleton={<HomeSkeleton />}>
          {() => null}
        </Loaded>
      </Page>
    );
  const dilemmas = list<Dilemma>(q.data.data.dilemmas);
  const quiz = list<QuizItem>(q.data.data.quiz);
  if (id === "quiz" && quiz.length) return <QuestionRun testID="ethics-run" title="Quick check" home="/ethics" steps={quizSteps(quiz)} onDone={send} takeaway="When the law sets a duty, it comes before what anyone in the room wants." />;
  const d = dilemmas.find((x) => x.id === id);
  if (!d)
    return (
      <Page testID="ethics-missing" home="/ethics" title="Ethics, law and referral">
        <QuietEmpty title="That dilemma has moved on" body="The set changes every day." action={{ label: "Today's dilemmas", onPress: () => router.replace("/ethics") }} art={<IconPatch icon={Scale} />} />
      </Page>
    );
  return <QuestionRun testID="ethics-run" calm title={d.tag} home="/ethics" steps={dilemmaSteps(d)} onDone={send} takeaway={d.law} rightTitle="That holds up" wrongTitle="There is a safer path" doneLabel="Back to the dilemmas" />;
}
