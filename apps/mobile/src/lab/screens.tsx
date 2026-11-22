import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, BookOpenText, Check, FlaskConical } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Chips, Label, QuietEmpty, RowsSkeleton, Stone, T } from "@/ds";
import { QuietError } from "@/library/kit";
import { Enter, ProgressFill, StaggerList } from "@/motion";
import { space, useTheme } from "@/theme";
import { useLabHome } from "./data";
import { LAB_AREAS, type LabArea, type LabExperiment } from "./types";
import { recordCheck, recordRun, useLabDone } from "./progress";
import { QuestionRun } from "./run";
import type { LabResult } from "./runners-a";
import { RUNNERS } from "./runners-b";
import { EntryCard, IconPatch, Page, Tag } from "./shell";

type Filter = "all" | LabArea;

function ExperimentCard({ e, done }: { e: LabExperiment; done: boolean }) {
  const c = useTheme();
  return (
    <Stone testID={`lab-${e.id}`} accessibilityLabel={`${e.title}. ${e.area}, ${e.minutes} minutes${done ? ", done" : ""}`} grow={() => router.push(`/lab/${encodeURIComponent(e.id)}`)}>
      <View style={{ gap: space[2] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          <Tag>{e.area}</Tag>
          <Tag>{`${e.minutes} min`}</Tag>
          <View style={{ flex: 1 }} />
          {done ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Check size={15} color={c.ink} strokeWidth={3} />
              <T v="caption">Done</T>
            </View>
          ) : (
            <ArrowRight size={18} color={c.muted} />
          )}
        </View>
        <T v="h2">{e.title}</T>
        <T v="small" tone="muted">
          {e.hook}
        </T>
      </View>
    </Stone>
  );
}

/** The Psychology Lab: classic experiments you run on yourself first and read about second. */
export function LabHomeScreen() {
  const q = useLabHome();
  const done = useLabDone();
  if (!q.data) return <LabLoading q={q} testID="lab-home" />;
  return <LabHome experiments={q.data.experiments} done={done} />;
}

/** The first load: a skeleton, then the error with a retry. */
function LabLoading({ q, testID }: { q: ReturnType<typeof useLabHome>; testID: string }) {
  return (
    <Page testID={testID} home="/practise" title="Psychology Lab" area="practise">
      {q.isError ? <QuietError what="the Lab" error={q.error} onRetry={() => void q.refetch()} testID="lab-error" /> : <RowsSkeleton />}
    </Page>
  );
}

function LabHome({ experiments: EXPERIMENTS, done }: { experiments: LabExperiment[]; done: ReturnType<typeof useLabDone> }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const areas = LAB_AREAS.filter((a) => EXPERIMENTS.some((e) => e.area === a));
  const list = EXPERIMENTS.filter((e) => filter === "all" || e.area === filter);
  const n = EXPERIMENTS.filter((e) => done[e.id]).length;
  const next = EXPERIMENTS.find((e) => !done[e.id]);
  return (
    <Page testID="lab-home" home="/practise" title="Psychology Lab" lead={n ? `${n} of ${EXPERIMENTS.length} run. Do it first, read about it second.` : "Run it on yourself first. Read about it second."} area="practise">
      {next && filter === "all" ? (
        <Enter i={0}>
          <View style={{ gap: space[2] }}>
            <Label>{n ? "Up next" : "Start here"}</Label>
            <Stone testID="lab-next" accessibilityLabel={`${next.title}. ${next.minutes} minutes`} grow={() => router.push(`/lab/${next.id}`)} pad={space[5]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                <IconPatch icon={FlaskConical} size={56} />
                <View style={{ flex: 1, minWidth: 0, gap: space[1] }}>
                  <T v="h2">{next.title}</T>
                  <T v="small" tone="muted">
                    {next.question}
                  </T>
                </View>
              </View>
            </Stone>
          </View>
        </Enter>
      ) : null}
      <View style={{ gap: space[3] }}>
        <Chips scroll label="Area of psychology" value={filter} onChange={setFilter} options={[{ id: "all" as Filter, name: "All" }, ...areas.map((a) => ({ id: a as Filter, name: a }))]} />
        <StaggerList key={filter} style={{ gap: space[3] }}>
          {list.map((e) => (
            <ExperimentCard key={e.id} e={e} done={!!done[e.id]} />
          ))}
        </StaggerList>
      </View>
      <View style={{ gap: space[2] }}>
        <Label>Also in the Lab</Label>
        <EntryCard testID="lab-casebook" icon={BookOpenText} title="Casebook" meta="Short clinical cases to read and reason through" href="/casebook" />
      </View>
    </Page>
  );
}

function Bars({ r }: { r: LabResult }) {
  const c = useTheme();
  if (!r.bars?.length) return null;
  const many = r.bars.length > 4;
  return (
    <View accessible accessibilityLabel={`${r.barsLabel ?? "Your data"}: ${r.bars.map((b) => `${b.label} ${Math.round(b.pct)} percent`).join(", ")}`} style={{ gap: space[2] }}>
      {r.barsLabel ? (
        <T v="caption" tone="muted">
          {r.barsLabel}
        </T>
      ) : null}
      {many ? (
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, height: 84 }}>
          {r.bars.map((b, i) => (
            <View key={i} style={{ flex: 1, alignItems: "center", gap: 2 }}>
              <View style={{ width: "100%", height: 4 + (Math.max(0, Math.min(100, b.pct)) / 100) * 60, borderRadius: 4, backgroundColor: c.ink }} />
              <T v="caption" tone="muted" num maxFontSizeMultiplier={1}>
                {b.label}
              </T>
            </View>
          ))}
        </View>
      ) : (
        r.bars.map((b, i) => (
          <View key={b.label} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <T v="small" style={{ width: 84 }}>
              {b.label}
            </T>
            <View style={{ flex: 1 }}>
              <ProgressFill pct={Math.max(0, Math.min(100, b.pct))} height={10} delay={i * 90} track={c.bg} color={c.ink} />
            </View>
          </View>
        ))
      )}
    </View>
  );
}

function Reading({ title, paras }: { title: string; paras: string[] }) {
  return (
    <View style={{ gap: space[2] }}>
      <T v="h2" accessibilityRole="header">
        {title}
      </T>
      {paras.map((p) => (
        <T key={p} v="reading">
          {p}
        </T>
      ))}
    </View>
  );
}

/** /lab/:id : what the experiment asks, the run, then your own data beside the classic finding. */
export function ExperimentScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const q = useLabHome();
  const e = q.data?.experiments.find((x) => x.id === String(id ?? ""));
  const done = useLabDone();
  const [stage, setStage] = React.useState<"page" | "run" | "check">("page");
  const [fresh, setFresh] = React.useState<LabResult | null>(null);
  if (!q.data) return <LabLoading q={q} testID="lab-experiment" />;
  if (!e)
    return (
      <Page testID="lab-missing" home="/lab" title="Psychology Lab">
        <QuietEmpty title="That experiment is not here" body="Choose one from the Lab." action={{ label: "All experiments", onPress: () => router.replace("/lab") }} />
      </Page>
    );
  const Runner = RUNNERS[e.id];
  if (stage === "run" && Runner)
    return (
      <Runner
        onClose={() => setStage("page")}
        onDone={(r) => {
          recordRun(e.id, r);
          setFresh(r);
          setStage("page");
        }}
      />
    );
  if (stage === "check")
    return <QuestionRun testID="lab-check" title={e.title} steps={e.checks.map((k, i) => ({ id: `${e.id}-${i}`, prompt: k.q, options: k.options, answer: k.answer, why: k.why }))} onClose={() => setStage("page")} onDone={(r) => recordCheck(e.id, r.map((x) => x.picked))} doneLabel="Back to the experiment" />;
  const mine = fresh ?? done[e.id]?.result ?? null;
  const check = done[e.id]?.check;
  return (
    <Page
      testID="lab-experiment"
      home="/lab"
      title={e.title}
      lead={e.hook}
      area="practise"
      footer={
        mine ? (
          <>
            <Button label={check ? `Check yourself again (${check.right} of ${check.total} last time)` : `Check yourself: ${e.checks.length} questions`} testID="lab-check-start" onPress={() => setStage("check")} />
            <Button kind="quiet" label="Run it again" testID="lab-again" onPress={() => setStage("run")} />
          </>
        ) : (
          <Button label="Run the experiment" testID="lab-start" disabled={!Runner} onPress={() => setStage("run")} />
        )
      }
    >
      {mine ? (
        <Enter i={0}>
          <View style={{ gap: space[2] }}>
            <Label>Your result</Label>
            <Stone testID="lab-result" pad={space[5]}>
              <View style={{ gap: space[4] }}>
                <T v="h2">{mine.headline}</T>
                <Bars r={mine} />
                <View style={{ gap: space[2] }}>
                  {mine.lines.map((l) => (
                    <View key={l.label} style={{ flexDirection: "row", justifyContent: "space-between", gap: space[3] }}>
                      <T v="small" tone="muted" style={{ flexShrink: 0, maxWidth: "45%" }}>
                        {l.label}
                      </T>
                      <T v="small" num style={{ flex: 1, textAlign: "right" }}>
                        {l.value}
                      </T>
                    </View>
                  ))}
                </View>
                {mine.notes?.length ? (
                  <View style={{ gap: space[2] }}>
                    <T v="label" tone="muted">
                      Next time
                    </T>
                    {mine.notes.map((n) => (
                      <T key={n} v="small">
                        {n}
                      </T>
                    ))}
                  </View>
                ) : null}
                <T v="caption" tone="muted">
                  One run on one day. Saved to your progress.
                </T>
              </View>
            </Stone>
          </View>
        </Enter>
      ) : (
        <Enter i={0}>
          <Stone pad={space[5]}>
            <View style={{ gap: space[3] }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                <Tag>{e.area}</Tag>
                <Tag>{e.level}</Tag>
                <Tag>{`${e.minutes} min`}</Tag>
              </View>
              <View style={{ gap: space[1] }}>
                <T v="label" tone="muted">
                  The question
                </T>
                <T v="reading">{e.question}</T>
              </View>
            </View>
          </Stone>
        </Enter>
      )}
      {mine ? (
        <>
          <Reading title="The classic finding" paras={[e.finding]} />
          <Reading title="Why it happens" paras={e.theory} />
          <Reading title="In the clinic" paras={e.clinic} />
          <View style={{ gap: space[2] }}>
            <Label>How solid is this?</Label>
            <Stone>
              <View style={{ gap: space[1] }}>
                <T v="bodyStrong">{e.evidence.status}</T>
                <T v="small" tone="muted">
                  {e.evidence.note}
                </T>
              </View>
            </Stone>
          </View>
          <View style={{ gap: space[2] }}>
            <Label>Think about it</Label>
            <T v="reading" style={{ paddingHorizontal: space[1] }}>
              {e.reflect}
            </T>
          </View>
        </>
      ) : (
        <Enter i={1}>
          <View style={{ gap: space[2] }}>
            <Label>What you do</Label>
            <View style={{ gap: space[2], paddingHorizontal: space[1] }}>
              {e.steps.map((s, n) => (
                <View key={s} style={{ flexDirection: "row", gap: space[3] }}>
                  <T v="bodyStrong" tone="muted" num style={{ width: 16 }}>
                    {n + 1}
                  </T>
                  <T style={{ flex: 1 }}>{s}</T>
                </View>
              ))}
            </View>
            <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
              You see your own data first. The explanation comes after.
            </T>
          </View>
        </Enter>
      )}
    </Page>
  );
}
