import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, OptionRow, ProgressLine, RowList, Section, T } from "@/ds";
import { motion, space, useTheme } from "@/theme";
import { play, useMove, usePlayQuery } from "../api";
import { EndPanel, EndThumb, FrameLoading, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { Story } from "../parts";
import { useReactions } from "../reactions";
import { WARD_KIND, WARD_QUALITY, WARD_VAR, type ProgressSnapshot, type WardCampaign, type WardReveal, type WardSolo, type WardVars } from "../types";

const HOW = ["One patient over several sessions. Read what happens, then make the call.", "Each choice moves five dials: risk, trust, insight, family support and sticking with care.", "After each call you see how strong it was and what the strongest call would have been.", "Your place is saved after every call. The ending depends on your choices."];

/** The five dials: a thin line each; risk is better low. */
function Dials({ vars, before }: { vars: WardVars; before?: WardVars }) {
  const c = useTheme();
  return (
    <View style={{ gap: space[2] }} accessibilityLabel="Dials">
      {(Object.keys(WARD_VAR) as (keyof WardVars)[]).map((k) => {
        const d = before ? vars[k] - before[k] : 0;
        const better = k === "risk" ? d < 0 : d > 0;
        return (
          <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }} accessible accessibilityLabel={`${WARD_VAR[k]} ${vars[k]}${d ? `, ${d > 0 ? "up" : "down"} ${Math.abs(d)}` : ""}`}>
            <T v="small" tone="muted" style={{ width: 112 }} numberOfLines={1}>
              {WARD_VAR[k]}
            </T>
            <View style={{ flex: 1 }}>
              <ProgressLine value={vars[k]} height={4} />
            </View>
            <T v="small" num style={{ width: 40, textAlign: "right", color: d ? (better ? c.ink : c.danger) : c.muted }}>
              {d ? `${d > 0 ? "+" : ""}${d}` : String(vars[k])}
            </T>
          </View>
        );
      })}
    </View>
  );
}

const verdictOf = (r: WardReveal) => ({ right: r.q === "best", partial: r.q === "ok", title: WARD_QUALITY[r.q] });

/** Ward Week: one patient, your choices change the ending. Dealt and scored on the server. */
export function WardGame() {
  const params = useLocalSearchParams<{ item?: string }>();
  const list = usePlayQuery<{ ok: true; campaigns: WardCampaign[] }>([], "ward", "campaigns");
  const progress = usePlayQuery<ProgressSnapshot>(["ward"], "cases", "progress", "ward");
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [pick, setPick] = React.useState<string | null>(params.item ?? null);
  const [solo, setSolo] = React.useState<WardSolo | null>(null);
  const [reveal, setReveal] = React.useState<WardReveal | null>(null);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const savedIds = new Set((progress.data?.rows ?? []).map((r) => r.item));
  const campaigns = list.data?.campaigns ?? [];
  const chosen = pick ?? campaigns[0]?.id ?? null;

  const begin = async (id: string, resume: boolean) => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => (resume ? play<WardSolo>("ward", "resume", { campaign: id }) : play<WardSolo>("ward", "start", id)));
    if (!r) return;
    setSolo(r);
    setReveal(null);
    setMarks([]);
  };

  if (!solo) {
    if (list.isLoading) return <FrameLoading title="Ward Week" />;
    const resume = chosen ? savedIds.has(chosen) : false;
    return (
      <StartScreen
        testID="ward-start"
        title="Ward Week"
        line="One patient. Your choices change the ending."
        howTo={HOW}
        choiceLabel="Patient"
        choices={campaigns.map((c) => ({ id: c.id, name: `${c.title}${savedIds.has(c.id) ? " · carry on" : ""}`, line: `${c.patient}. ${c.place}. ${c.sessions} sessions.` }))}
        choice={chosen ?? undefined}
        onChoice={setPick}
        playLabel={resume ? "Carry on" : "Start"}
        onPlay={() => chosen && void begin(chosen, resume)}
        busy={mv.pending}
        error={mv.error ?? (list.isError ? "The patients did not load. Try again." : null)}
      />
    );
  }

  const s = solo.scene;
  if (solo.end && !reveal) {
    const e = solo.end;
    const strong = e.log.filter((l) => l.q === "best").length;
    return (
      <GameFrame testID="game-ward" title={s.title} thumb={<EndThumb again={() => setSolo(null)} againLabel="Choose another patient" />}>
        <EndPanel kicker="The ending" score={String(e.score)} scoreOf="/100" line={e.title} right={strong} total={Math.max(1, e.log.length)} stats={[{ label: "Strong calls", value: `${strong}/${e.log.length}` }, ...(solo.xp ? [{ label: "XP", value: `+${solo.xp}` }] : [])]}>
          <T v="reading">{e.text}</T>
          <Dials vars={e.vars} />
          <Section title="Every call">
            <RowList>
              {e.log.map((l, k) => (
                <View key={k} style={{ paddingVertical: space[3], gap: 2 }}>
                  <T v="caption" tone="muted">
                    {`SESSION ${l.chapter + 1} · ${WARD_KIND[l.kind].toUpperCase()} · ${WARD_QUALITY[l.q].toUpperCase()}`}
                  </T>
                  <T v="bodyStrong">{l.text}</T>
                  {l.best ? (
                    <T v="small" tone="muted">
                      Strongest: {l.best}
                    </T>
                  ) : null}
                </View>
              ))}
            </RowList>
          </Section>
        </EndPanel>
      </GameFrame>
    );
  }

  const choose = async (option: string) => {
    if (reveal || mv.pending) return;
    const r = await mv.run(() => play<WardSolo>("ward", "pick", { token: solo.token, option }));
    if (!r) return;
    if (r.reveal) {
      setReveal(r.reveal);
      setMarks((m) => [...m, r.reveal!.q === "best" ? "ok" : r.reveal!.q === "ok" ? null : "miss"]);
      react.answer(r.reveal.q === "best");
    }
    setSolo(r);
  };
  const next = () => setReveal(null);
  const shown = reveal ? { chapterTitle: reveal.chapterTitle, beats: reveal.beats } : { chapterTitle: s.chapterTitle, beats: s.beats };
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={s.chapter} total={s.sessions} />
      <HudLine left={`Session ${(reveal?.chapter ?? s.chapter) + 1} of ${s.sessions} · ${s.patient}`} right={marks.length ? `${marks.filter((m) => m === "ok").length} strong` : undefined} />
    </View>
  );
  return (
    <GameFrame testID="game-ward" title={s.title} howTo={HOW} hud={hud} confirmLeave saves thumb={reveal ? <Button label={solo.end ? "See the ending" : "Next"} onPress={next} testID="ward-next" /> : undefined}>
      <Animated.View key={`${s.step}-${!!reveal}`} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[5] }}>
        <T v="h2">{shown.chapterTitle}</T>
        <Story>
          {shown.beats.map((b, k) => (
            <T key={k} v="reading">
              {b}
            </T>
          ))}
        </Story>
        {reveal ? (
          <View style={{ gap: space[4] }}>
            <View style={{ gap: space[1] }}>
              <T v="caption" tone="muted">
                {`YOUR CALL · ${WARD_KIND[reveal.kind].toUpperCase()}`}
              </T>
              <T v="bodyStrong">{reveal.text}</T>
            </View>
            <Verdict {...verdictOf(reveal)} why={`${reveal.why}${reveal.best ? `\n\nStrongest call: ${reveal.best.text} ${reveal.best.why}` : ""}`} seed={s.step} />
            <Dials vars={reveal.after} before={reveal.before} />
          </View>
        ) : s.decision ? (
          <View style={{ gap: space[3] }}>
            <T v="caption" tone="muted">
              {WARD_KIND[s.decision.kind].toUpperCase()}
            </T>
            <T v="h3">{s.decision.prompt}</T>
            {s.decision.options.map((o, j) => (
              <OptionRow key={o.id} index={j} text={o.text} testID={`ward-option-${j}`} disabled={mv.pending} onPress={() => void choose(o.id)} />
            ))}
            <Dials vars={s.vars} />
          </View>
        ) : null}
        <MoveError text={mv.error} />
      </Animated.View>
    </GameFrame>
  );
}
