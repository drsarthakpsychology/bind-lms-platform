import { Check, MessagesSquare } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Field, Label, Stone, T } from "@/ds";
import { IconPatch, leave, Page, PlayShell, Tag } from "@/lab/shell";
import { Enter, Press, ProgressRing, RollingNumber, StaggerList, Swap } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { INTERVIEWS, type InterviewCategory, type InterviewQuestion } from "./mock";

/** The order a panel usually runs (src/lib/prep/interview.ts on the website). */
export const PANEL_ORDER: InterviewCategory[] = ["motivation", "academic", "clinical-vignette", "assessment", "research", "ethics", "current-affairs"];
export const CATEGORY_LABEL: Record<InterviewCategory, string> = { motivation: "About you", academic: "Subject knowledge", "clinical-vignette": "A case", assessment: "Tests and assessment", research: "Research", ethics: "Ethics and law", "current-affairs": "Current affairs" };
export const PANEL_SIZE = 5;

/** One question per category in panel order, up to five; `turn` moves to the next question in each category. */
export function pickPanel(bank: InterviewQuestion[], turn = 0, size = PANEL_SIZE): InterviewQuestion[] {
  const out: InterviewQuestion[] = [];
  for (const cat of PANEL_ORDER) {
    if (out.length >= size) break;
    const pool = bank.filter((q) => q.category === cat);
    const q = pool[turn % Math.max(1, pool.length)];
    if (q) out.push(q);
  }
  return out;
}

export type SelfScore = { pct: number; band: "strong" | "okay" | "weak" };
/** The website's selfScore: share of points covered, minus 15 for each slip admitted. */
export function selfScore(mustCover: number, covered: number, redFlags: number): SelfScore {
  const base = mustCover > 0 ? (Math.min(covered, mustCover) / mustCover) * 100 : 0;
  const pct = Math.max(0, Math.min(100, Math.round(base - 15 * Math.max(0, redFlags))));
  return { pct, band: pct >= 75 ? "strong" : pct >= 45 ? "okay" : "weak" };
}
const BAND: Record<SelfScore["band"], string> = { strong: "Strong", okay: "Getting there", weak: "Needs work" };

type Done = { q: InterviewQuestion; score: SelfScore };

function Tick({ label, on, onPress, testID }: { label: string; on: boolean; onPress: () => void; testID?: string }) {
  const c = useTheme();
  return (
    <Press testID={testID} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label} feel="select" onPress={onPress} scale={0.98} innerStyle={{ flexDirection: "row", gap: space[3], minHeight: layout.target, alignItems: "center", paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: layout.radius, backgroundColor: on ? c.ink : c.card }}>
      <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }}>{on ? <Check size={16} color={c.ink} strokeWidth={3} /> : null}</View>
      <T v="small" style={{ flex: 1, color: on ? c.bg : c.ink }}>
        {label}
      </T>
    </Press>
  );
}

/**
 * Mock interview: five questions the way a panel asks them. Answer, take one
 * follow-up, then mark yourself against what a strong answer covers and read
 * one. Speaking the answer aloud first is the point; the box is for notes
 * (the phone keyboard's microphone works here too).
 */
export function InterviewScreen() {
  const [turn, setTurn] = React.useState(0);
  const panel = React.useMemo(() => pickPanel(INTERVIEWS, turn), [turn]);
  const [idx, setIdx] = React.useState(-1);
  const [stage, setStage] = React.useState<"answer" | "follow" | "check">("answer");
  const [main, setMain] = React.useState("");
  const [follow, setFollow] = React.useState("");
  const [covered, setCovered] = React.useState<string[]>([]);
  const [flags, setFlags] = React.useState<string[]>([]);
  const [done, setDone] = React.useState<Done[]>([]);
  const cur = panel[idx];
  const flip = (list: string[], set: (v: string[]) => void, x: string) => set(list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);
  const start = () => {
    setDone([]);
    setIdx(0);
    setStage("answer");
  };

  if (idx < 0)
    return (
      <Page testID="interview" home="/prep" title="Mock interview" lead="Five questions, the way a panel asks them." area="practise" footer={<Button label="Start the interview" testID="interview-start" disabled={!panel.length} onPress={start} />}>
        <Enter i={0}>
          <Stone pad={space[5]}>
            <View style={{ gap: space[4] }}>
              <IconPatch icon={MessagesSquare} />
              {["Say your answer out loud, then note the main points.", "Take one follow-up, as a panel would ask.", "Mark yourself against what a strong answer covers, and read one."].map((s, n) => (
                <View key={s} style={{ flexDirection: "row", gap: space[3] }}>
                  <T v="bodyStrong" tone="muted" num style={{ width: 16 }}>
                    {n + 1}
                  </T>
                  <T style={{ flex: 1 }}>{s}</T>
                </View>
              ))}
            </View>
          </Stone>
        </Enter>
        <Enter i={1}>
          <View style={{ gap: space[2] }}>
            <Label>This round</Label>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], paddingHorizontal: space[1] }}>
              {panel.map((q) => (
                <Tag key={q.id} onLayer>
                  {CATEGORY_LABEL[q.category]}
                </Tag>
              ))}
            </View>
            <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
              About 15 minutes. You can stop at any point.
            </T>
          </View>
        </Enter>
      </Page>
    );

  if (!cur) {
    const avg = done.length ? Math.round(done.reduce((a, d) => a + d.score.pct, 0) / done.length) : 0;
    return (
      <PlayShell
        testID="interview-result"
        title="Mock interview"
        onClose={() => leave("/prep")}
        footer={
          <>
            <Button label="Done" testID="interview-done" onPress={() => leave("/prep")} />
            <Button
              kind="quiet"
              label="Another round"
              testID="interview-again"
              onPress={() => {
                setTurn((t) => t + 1);
                setIdx(-1);
              }}
            />
          </>
        }
      >
        <Enter i={0}>
          <Stone pad={space[5]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
              <ProgressRing pct={avg} size={72} stroke={7} label={`${avg} percent`} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
                  <RollingNumber value={avg} v="display" testID="interview-score" />
                  <T v="h2">%</T>
                </View>
                <T v="small" tone="muted">
                  By your own marking, across {done.length} {done.length === 1 ? "question" : "questions"}.
                </T>
              </View>
            </View>
          </Stone>
        </Enter>
        <View style={{ gap: space[2] }}>
          <Label>Question by question</Label>
          <StaggerList style={{ gap: space[2] }}>
            {done.map((d) => (
              <Stone key={d.q.id}>
                <View style={{ gap: space[1] }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
                    <T v="caption" tone="muted">
                      {CATEGORY_LABEL[d.q.category]}
                    </T>
                    <T v="caption" num>{`${BAND[d.score.band]} · ${d.score.pct}%`}</T>
                  </View>
                  <T v="bodyStrong">{d.q.question}</T>
                </View>
              </Stone>
            ))}
          </StaggerList>
        </View>
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
          This round is not kept after you close it.
        </T>
      </PlayShell>
    );
  }

  const followUp = cur.followUps[0] ?? null;
  const score = selfScore(cur.mustCover.length, covered.length, flags.length);
  const next = () => {
    setDone((d) => [...d, { q: cur, score }]);
    setMain("");
    setFollow("");
    setCovered([]);
    setFlags([]);
    setStage("answer");
    setIdx(idx + 1);
  };
  const footer =
    stage === "answer" ? (
      <Button label={followUp ? "Next: the follow-up" : "Mark my answer"} testID="interview-next" disabled={main.trim().length < 3} onPress={() => setStage(followUp ? "follow" : "check")} />
    ) : stage === "follow" ? (
      <Button label="Mark my answer" testID="interview-mark" onPress={() => setStage("check")} />
    ) : (
      <Button kind="ink" label={idx === panel.length - 1 ? "See how it went" : "Next question"} testID="interview-continue" onPress={next} />
    );
  return (
    <PlayShell testID="interview-run" done={idx + (stage === "check" ? 1 : 0)} total={panel.length} onClose={() => leave("/prep")} footer={footer}>
      <Swap k={`${cur.id}-${stage}`} dir={1} style={{ gap: space[4] }}>
        <Tag onLayer>{CATEGORY_LABEL[cur.category]}</Tag>
        {stage === "answer" ? (
          <>
            <T v="h2" accessibilityRole="header">
              {cur.question}
            </T>
            <Field label="Your answer, in points" hint="Say it out loud first. Two minutes is about right." area value={main} onChangeText={setMain} maxLength={2000} testID="interview-answer" />
          </>
        ) : stage === "follow" ? (
          <>
            <T v="small" tone="muted">
              {cur.question}
            </T>
            <View style={{ gap: space[1] }}>
              <Label>The panel follows up</Label>
              <T v="h2" accessibilityRole="header">
                {followUp}
              </T>
            </View>
            <Field label="Your answer, in points" area value={follow} onChangeText={setFollow} maxLength={1200} testID="interview-follow" />
          </>
        ) : (
          <>
            <T v="h3">{cur.question}</T>
            <View style={{ gap: space[2] }}>
              <Label>Tick what your answer covered</Label>
              {cur.mustCover.map((x, n) => (
                <Tick key={x} testID={`cover-${n}`} label={x} on={covered.includes(x)} onPress={() => flip(covered, setCovered, x)} />
              ))}
            </View>
            {cur.redFlags.length ? (
              <View style={{ gap: space[2] }}>
                <Label>Be honest: did any of these slip in?</Label>
                {cur.redFlags.map((x, n) => (
                  <Tick key={x} testID={`flag-${n}`} label={x} on={flags.includes(x)} onPress={() => flip(flags, setFlags, x)} />
                ))}
              </View>
            ) : null}
            <Stone>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <T v="bodyStrong">{BAND[score.band]}</T>
                <RollingNumber value={score.pct} suffix="%" v="h2" testID="interview-self" />
              </View>
            </Stone>
            <View style={{ gap: space[2] }}>
              <Label>A strong answer</Label>
              <T v="reading" style={{ paddingHorizontal: space[1] }}>
                {cur.modelAnswer}
              </T>
            </View>
          </>
        )}
      </Swap>
    </PlayShell>
  );
}
