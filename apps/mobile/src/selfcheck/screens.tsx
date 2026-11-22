import { router, useLocalSearchParams } from "expo-router";
import { Activity, Brain, ClipboardCheck, Focus, HeartPulse, Smile, Sun, Wind } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { Button, Label, OptionList, QuietEmpty, Stone, T } from "@/ds";
import { HelpLine } from "@/calm/screens";
import { EntryCard, leave, Page, PlayShell, Tag, type IconType } from "@/lab/shell";
import { Enter, ProgressFill, RollingNumber, StaggerList, Swap } from "@/motion";
import { space, useTheme } from "@/theme";
import { getInstrument, INSTRUMENTS, scoreInstrument, TRAITS, type Instrument, type Result } from "./tests";

const ICON: Record<string, IconType> = { "phq-9": HeartPulse, "gad-7": Activity, "who-5": Sun, "self-esteem": Smile, asrs: Focus, "big-five": Brain };
const iconFor = (id: string): IconType => ICON[id] ?? ClipboardCheck;

/** The self-checks: six short, published questionnaires. Scored on the phone; nothing is stored or sent. */
export function SelfCheckHomeScreen() {
  return (
    <Page testID="selfcheck-home" home="/home" title="Self-checks" lead="Short, well-tested questionnaires. Your answers stay on this phone." area="me">
      <StaggerList style={{ gap: space[3] }}>
        {INSTRUMENTS.map((x) => (
          <EntryCard key={x.id} testID={`selfcheck-${x.id}`} icon={iconFor(x.id)} area="me" title={x.short} meta={`${x.name} · ${x.items.length} questions · ${x.minutes} min`} href={`/selfcheck/${x.id}`} />
        ))}
      </StaggerList>
      <Enter i={3}>
        <View style={{ gap: space[2] }}>
          <Label>Good to know</Label>
          <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
            A self-check is a first look, not a diagnosis. Only a clinician who has spoken with you can make one.
          </T>
        </View>
      </Enter>
      <Enter i={4}>
        <HelpLine />
      </Enter>
    </Page>
  );
}

/** /selfcheck/:id: the intro, the questions one at a time, then the result. */
export function SelfCheckRunScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const inst = getInstrument(String(id ?? ""));
  if (!inst)
    return (
      <Page testID="selfcheck-missing" home="/selfcheck" title="Self-checks">
        <QuietEmpty title="That self-check is not here" body="Choose one from the list." action={{ label: "All self-checks", onPress: () => router.replace("/selfcheck") }} />
      </Page>
    );
  return <Run key={inst.id} inst={inst} />;
}

function Run({ inst }: { inst: Instrument }) {
  const [stage, setStage] = React.useState<"intro" | "ask" | "extra" | "result">("intro");
  const [i, setI] = React.useState(0);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [answers, setAnswers] = React.useState<(number | null)[]>(() => inst.items.map(() => null));
  const [extra, setExtra] = React.useState<number | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const total = inst.items.length + (inst.extra ? 1 : 0);

  if (stage === "intro")
    return (
      <Page testID="selfcheck-intro" home="/selfcheck" title={inst.short} lead={inst.measures} area="me" footer={<Button label="Start" testID="selfcheck-start" onPress={() => setStage("ask")} />}>
        <Enter i={0}>
          <Stone pad={space[5]}>
            <View style={{ gap: space[3] }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                <Tag>{inst.name}</Tag>
                <Tag>{`${inst.items.length} questions`}</Tag>
                <Tag>{`${inst.minutes} min`}</Tag>
                <Tag>{inst.forWhom}</Tag>
              </View>
              <T v="reading">{inst.intro}</T>
            </View>
          </Stone>
        </Enter>
        <Enter i={1}>
          <View style={{ gap: space[2] }}>
            <Label>Before you start</Label>
            <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
              Answer honestly; there are no right answers. Nothing you choose is saved or sent. The result is a first look, not a diagnosis.
            </T>
          </View>
        </Enter>
        <Enter i={2}>
          <HelpLine />
        </Enter>
      </Page>
    );

  if (stage === "result") {
    const result = scoreInstrument(inst, answers.map((a) => a ?? 0));
    return <ResultView inst={inst} result={result} extra={extra} onAgain={() => { setAnswers(inst.items.map(() => null)); setExtra(null); setI(0); setStage("intro"); }} />;
  }

  const asking = stage === "ask";
  const item = inst.items[i]!;
  const picked = asking ? inst.options.findIndex((o) => o.value === answers[i]) : extra;
  const forward = () => {
    setDir(1);
    if (asking && i < inst.items.length - 1) setI(i + 1);
    else if (asking && inst.extra) setStage("extra");
    else setStage("result");
  };
  const pick = (n: number) => {
    if (asking) setAnswers((a) => a.map((v, k) => (k === i ? inst.options[n]!.value : v)));
    else setExtra(n);
    // The choice shows for a moment, then the next question comes by itself. Next is always there too.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(forward, 260);
  };
  const back = () => {
    if (timer.current) clearTimeout(timer.current);
    setDir(-1);
    if (!asking) setStage("ask");
    else if (i > 0) setI(i - 1);
    else setStage("intro");
  };
  const answered = picked !== null && picked >= 0;
  return (
    <PlayShell
      testID="selfcheck-run"
      done={asking ? i : inst.items.length}
      total={total}
      onClose={() => leave("/selfcheck")}
      footer={
        <View style={{ flexDirection: "row", gap: space[2] }}>
          <Button kind="quiet" full={false} label="Back" testID="selfcheck-back" onPress={back} style={{ flex: 1 }} />
          <Button kind={answered ? "ink" : "quiet"} full={false} label={asking || inst.extra ? (!asking || (i === inst.items.length - 1 && !inst.extra) ? "See result" : "Next") : "See result"} testID="selfcheck-next" disabled={!answered} onPress={forward} style={{ flex: 2 }} />
        </View>
      }
    >
      <Swap k={asking ? i : "extra"} dir={dir} style={{ gap: space[4] }}>
        <T v="small" tone="muted">
          {asking ? inst.stem : "One more, not scored"}
        </T>
        <T v="h2" accessibilityRole="header">
          {asking ? item.text : inst.extra!.text}
        </T>
        <OptionList testID="selfcheck-options" options={asking ? inst.options.map((o) => o.label) : inst.extra!.options} picked={answered ? picked : null} onPick={pick} />
      </Swap>
    </PlayShell>
  );
}

const TONE_WORD = { ok: "In the usual range", mild: "A little raised", moderate: "Worth a proper look", high: "Please talk to someone soon" } as const;

function ScaleBar({ inst, score }: { inst: Instrument; score: number }) {
  const c = useTheme();
  const bands = inst.bands ?? [];
  return (
    <View accessible accessibilityLabel={`Where your score sits: ${bands.find((b) => score >= b.min && score <= b.max)?.label ?? ""}`} style={{ gap: space[1] }}>
      <View style={{ flexDirection: "row", gap: 3 }}>
        {bands.map((b) => {
          const on = score >= b.min && score <= b.max;
          return <View key={b.label} style={{ flex: b.max - b.min + 1, height: 10, borderRadius: 5, backgroundColor: on ? c.ink : c.bg }} />;
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <T v="caption" tone="muted">
          {bands[0]?.label}
        </T>
        <T v="caption" tone="muted">
          {bands[bands.length - 1]?.label}
        </T>
      </View>
    </View>
  );
}

function nextSteps(inst: Instrument, r: Result): string[] {
  if (r.kind === "total" || r.kind === "who5")
    return r.band.tone === "ok"
      ? ["Keep doing what works for you: sleep, movement, people you trust.", "Check in again any time things change."]
      : r.band.tone === "mild"
        ? ["Try a calm exercise, and take this again in 2 weeks.", "Tell someone you trust how you have been feeling.", "If it is getting worse or not easing, talk to a professional."]
        : ["Book a consultation with a clinical psychologist or psychiatrist. Show them this result.", "Tele-MANAS (14416) can talk it through with you today and point you to help nearby. It is free.", "You do not need to wait until it gets worse. Help works best early."];
  if (r.kind === "asrs")
    return r.positive
      ? ["Ask a psychiatrist or clinical psychologist for a full ADHD assessment.", "Low mood, anxiety, poor sleep and thyroid problems can look like ADHD, so a proper assessment checks for these too."]
      : ["If focus is still a struggle, sleep, stress and mood are worth checking first.", "The low mood and anxiety checks here take 2 to 3 minutes each."];
  return ["Personality is fairly stable but not fixed. It shifts slowly with age and experience.", `There is no good or bad profile on the ${inst.name}. Every trait has strengths at both ends.`];
}

function ResultView({ inst, result, extra, onAgain }: { inst: Instrument; result: Result; extra: number | null; onAgain: () => void }) {
  const c = useTheme();
  const urgent = result.flags.includes("self-harm");
  const others = INSTRUMENTS.filter((x) => x.id !== inst.id).slice(0, 2);
  const lead = result.kind === "total" || result.kind === "who5" ? result.band.label : result.kind === "asrs" ? (result.positive ? "Screen positive" : "Screen negative") : "Your Big Five profile";
  return (
    <Page testID="selfcheck-result" home="/selfcheck" title="Your result" lead={inst.name} area="me">
      {urgent ? (
        <Enter i={0}>
          <View testID="selfcheck-urgent" accessibilityRole="alert" style={{ backgroundColor: c.alertBg, borderRadius: 26, padding: space[4], gap: space[2] }}>
            <T v="h3" style={{ color: c.alertFg }}>
              About question 9
            </T>
            <T style={{ color: c.alertFg }}>You said you have had thoughts of being better off dead or of hurting yourself. Whatever your total score, that matters. Please tell someone you trust today, and call Tele-MANAS on 14416. If you might act on these thoughts, call 112 or go to the nearest hospital emergency.</T>
          </View>
          <View style={{ height: space[2] }} />
          <HelpLine urgent />
        </Enter>
      ) : null}
      <Enter i={1}>
        <Stone pad={space[5]}>
          {result.kind === "total" || result.kind === "who5" ? (
            <View style={{ gap: space[3] }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[1] }}>
                <RollingNumber value={result.score} v="display" testID="selfcheck-score" />
                <T tone="muted" num>{`of ${result.max}`}</T>
              </View>
              <View style={{ gap: 2 }}>
                <T v="h2">{lead}</T>
                <T v="small" tone="muted">
                  {TONE_WORD[result.band.tone]}
                </T>
              </View>
              <ScaleBar inst={inst} score={result.score} />
              <T>{result.band.advice}</T>
              <T v="small" tone="muted">
                {result.kind === "who5" ? `Raw score ${result.raw} of 25, multiplied by 4. Higher is better.` : inst.id === "self-esteem" ? "Higher scores mean higher self-esteem." : "Higher scores mean more symptoms."}
              </T>
            </View>
          ) : result.kind === "asrs" ? (
            <View style={{ gap: space[3] }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[1] }}>
                <RollingNumber value={result.positives} v="display" testID="selfcheck-score" />
                <T tone="muted">of 6 answers in the range that counts</T>
              </View>
              <T v="h2">{lead}</T>
              <T>{result.positive ? "4 or more answers in that range means your symptoms fit adult ADHD, and a full assessment by a psychiatrist or clinical psychologist is worth it." : "Fewer than 4 answers in that range. This screener does not point to adult ADHD, but if attention problems are affecting your life, it is still worth talking to someone."}</T>
              <T v="small" tone="muted">
                Questions 1 to 3 count from Sometimes; questions 4 to 6 count from Often.
              </T>
            </View>
          ) : (
            <View style={{ gap: space[4] }}>
              <T v="h2">{lead}</T>
              {result.traits.map((t, n) => (
                <View key={t.key} style={{ gap: space[1] }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <T v="bodyStrong">{TRAITS[t.key].name}</T>
                    <T v="small" tone="muted" num>{`${t.score} of 20 · ${t.level}`}</T>
                  </View>
                  <ProgressFill pct={((t.score - 4) / 16) * 100} height={8} delay={n * 80} track={c.bg} />
                  <T v="small" tone="muted">
                    {t.level === "high" ? TRAITS[t.key].high : t.level === "low" ? TRAITS[t.key].low : TRAITS[t.key].mid}
                  </T>
                </View>
              ))}
            </View>
          )}
        </Stone>
      </Enter>
      {inst.extra && extra !== null ? (
        <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>{`How hard this has made daily life: ${inst.extra.options[extra]}.`}</T>
      ) : null}
      <Enter i={2}>
        <View style={{ gap: space[2] }}>
          <Label>What to do next</Label>
          <View style={{ gap: space[2], paddingHorizontal: space[1] }}>
            {nextSteps(inst, result).map((s) => (
              <View key={s} style={{ flexDirection: "row", gap: space[2] }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.ink, marginTop: 9 }} />
                <T style={{ flex: 1 }}>{s}</T>
              </View>
            ))}
          </View>
        </View>
      </Enter>
      <Enter i={3}>
        <View style={{ gap: space[3] }}>
          <EntryCard testID="result-calm" icon={Wind} area="me" title="Try a calm exercise" meta="Breathing, grounding and more" href="/calm" />
          <View style={{ flexDirection: "row", gap: space[3] }}>
            {others.map((x) => (
              <EntryCard key={x.id} tall testID={`result-other-${x.id}`} icon={iconFor(x.id)} area="me" title={x.short} meta={`${x.minutes} min`} href={`/selfcheck/${x.id}`} />
            ))}
          </View>
          <Button kind="quiet" label="Take it again" testID="selfcheck-again" onPress={onAgain} />
        </View>
      </Enter>
      {urgent ? null : (
        <Enter i={4}>
          <HelpLine />
        </Enter>
      )}
      <T v="caption" tone="faint" style={{ paddingHorizontal: space[1] }}>
        {`Source: ${inst.source} This is a screening, not a diagnosis.`}
      </T>
    </Page>
  );
}
