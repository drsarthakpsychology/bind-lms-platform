import * as React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { Button, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { fonts, layout, motion, space, useTheme } from "@/theme";
import { play, useMove } from "../api";
import { MSE_DOMAINS, termLabel } from "../data";
import { EndPanel, EndThumb, GameFrame, HudLine, MoveError, StartScreen, StepStrip, Verdict } from "../frame";
import { AnswerRow } from "../parts";
import { useReactions } from "../reactions";
import type { MseDeal, MseExcerpt, MseLevel, MseReveal, MseTag } from "../types";

const HOW = ["Read the interview. One finding at a time is **marked in blue**.", "First pick the part of the mental state it belongs to, then the word for it.", "Right part and right word is a full point; the right word alone or a close word gets part of one.", "Five excerpts a round; it gets harder when you do well."];
const LEVELS: { id: string; name: string; line: string }[] = [
  { id: "1", name: "Starting", line: "One clear finding at a time" },
  { id: "2", name: "Building", line: "Findings that look alike" },
  { id: "3", name: "Hard", line: "A full interview, subtle signs" },
];
const WHO: Record<string, string> = { D: "Doctor", P: "Patient", R: "Relative" };

/** Split text into plain runs and the marked quote (the website's segments rule). */
export function segments(text: string, quote: string | undefined): { text: string; on: boolean }[] {
  if (!quote) return [{ text, on: false }];
  const at = text.indexOf(quote);
  if (at < 0) return [{ text, on: false }];
  return [
    { text: text.slice(0, at), on: false },
    { text: quote, on: true },
    { text: text.slice(at + quote.length), on: false },
  ].filter((s) => s.text);
}

/** MSE Lab: tag every finding in an interview. Each tag is checked on the server. */
export function MseGame() {
  const c = useTheme();
  const reduce = useReducedMotion();
  const mv = useMove();
  const react = useReactions();
  const [level, setLevel] = React.useState("1");
  const [run, setRun] = React.useState<{ token: string; ex: MseExcerpt } | null>(null);
  const [f, setF] = React.useState(0);
  const [domain, setDomain] = React.useState<string | null>(null);
  const [reveal, setReveal] = React.useState<MseReveal | null>(null);
  const [pending, setPending] = React.useState<MseTag | null>(null);
  const [score, setScore] = React.useState(0);
  const [exN, setExN] = React.useState(0);
  const [marks, setMarks] = React.useState<("ok" | "miss" | null)[]>([]);
  const [results, setResults] = React.useState<number[]>([]);
  const [over, setOver] = React.useState(false);

  const start = async () => {
    mv.reset();
    react.reset();
    const r = await mv.run(() => play<MseDeal>("mse", "deal", Number(level) as MseLevel));
    if (!r) return;
    setRun({ token: r.token, ex: r.excerpt });
    setF(0);
    setDomain(null);
    setReveal(null);
    setScore(0);
    setExN(0);
    setMarks([]);
    setResults([]);
    setOver(false);
  };

  if (!run) return <StartScreen testID="mse-start" title="MSE Lab" line="Tag every finding in an interview: the part of the mental state, then the word." howTo={HOW} choiceLabel="Level" choices={LEVELS} choice={level} onChoice={setLevel} onPlay={() => void start()} busy={mv.pending} error={mv.error} />;

  if (over) {
    const right = results.filter((x) => x >= 1).length;
    return (
      <GameFrame testID="game-mse" title="MSE Lab" thumb={<EndThumb again={() => void start()} />}>
        <EndPanel score={String(score)} line={`${exN} interview${exN === 1 ? "" : "s"} read`} right={right} total={Math.max(1, results.length)} stats={[{ label: "Findings right", value: `${right}/${results.length}` }, { label: "Part marks", value: String(results.filter((x) => x > 0 && x < 1).length) }]} />
      </GameFrame>
    );
  }

  const ex = run.ex;
  const quote = ex.quotes[f];
  const options = ex.options[f] ?? [];
  const tag = async (term: string) => {
    if (!domain || reveal || mv.pending) return;
    const r = await mv.run(() => play<MseTag>("mse", "tag", { token: run.token, domain, term }));
    if (!r) return;
    setRun({ ...run, token: r.token });
    setReveal(r.reveal);
    setPending(r);
    setScore((s) => s + Math.round(r.reveal.score * 10));
    setResults((x) => [...x, r.reveal.score]);
    setMarks((m) => [...m, r.reveal.score >= 1 ? "ok" : "miss"]);
    react.answer(r.reveal.score >= 1);
  };
  const next = () => {
    const p = pending;
    setReveal(null);
    setDomain(null);
    setPending(null);
    if (f + 1 < ex.quotes.length) {
      setF(f + 1);
      return;
    }
    setExN((n) => n + 1);
    if (p?.next) {
      setRun({ token: run.token, ex: p.next });
      setF(0);
      setMarks([]);
    } else setOver(true);
  };

  const mark = (text: string) =>
    segments(text, quote).map((s, k) =>
      s.on ? (
        <T key={k} v="reading" style={{ fontFamily: fonts.semibold, color: c.link, textDecorationLine: "underline" }}>
          {s.text}
        </T>
      ) : (
        s.text
      ),
    );
  const hud = (
    <View style={{ gap: space[2] }}>
      <StepStrip at={f} total={ex.quotes.length} marks={marks} />
      <HudLine left={`Finding ${f + 1} of ${ex.quotes.length} · Interview ${exN + 1}`} />
    </View>
  );
  return (
    <GameFrame testID="game-mse" title="MSE Lab" howTo={HOW} score={String(score)} hud={hud} confirmLeave thumb={reveal ? <Button label={f + 1 < ex.quotes.length ? "Next finding" : pending?.next ? "Next interview" : "See my score"} onPress={next} testID="mse-next" /> : undefined}>
      <Animated.View key={`${exN}`} entering={reduce ? undefined : FadeIn.duration(motion.state)} style={{ gap: space[4] }}>
        <View style={{ gap: 2 }}>
          <T v="bodyStrong">{ex.who}</T>
          <T v="small" tone="muted">
            {ex.place}
          </T>
        </View>
        <View style={{ gap: space[3] }}>
          {ex.lines.map(([w, t], k) => (
            <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
              <T v="caption" tone="muted" style={{ width: 56, paddingTop: 4 }}>
                {(WHO[w] ?? w).toUpperCase()}
              </T>
              <T v="reading" style={{ flex: 1 }}>
                {mark(t)}
              </T>
            </View>
          ))}
          <View style={{ borderLeftWidth: 3, borderColor: c.hairline, paddingLeft: space[3] }}>
            <T v="caption" tone="muted">
              WHAT YOU SEE
            </T>
            <T v="reading">{mark(ex.note)}</T>
          </View>
        </View>
      </Animated.View>
      <View style={{ gap: space[3] }}>
        <T v="h3">
          {reveal ? "Finding" : domain ? "Which word?" : "Which part of the mental state?"}
        </T>
        <T v="small" tone="muted" testID="mse-quote">
          “{quote}”
        </T>
        {!domain && !reveal ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }} accessibilityRole="radiogroup" accessibilityLabel="Part of the mental state">
            {MSE_DOMAINS.map((d) => (
              <Pressable
                key={d.id}
                accessibilityRole="radio"
                accessibilityLabel={d.label}
                onPress={() => {
                  haptic.select();
                  setDomain(d.id);
                }}
                testID={`mse-domain-${d.id}`}
                style={({ pressed }) => ({ minHeight: layout.target, paddingHorizontal: space[4], justifyContent: "center", borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: pressed ? c.tint : "transparent" })}
              >
                <T v="small">{d.short}</T>
              </Pressable>
            ))}
          </View>
        ) : null}
        {domain && !reveal ? (
          <View style={{ gap: space[3] }}>
            {options.map((t, j) => (
              <AnswerRow key={t} index={j} text={termLabel(t)} testID={`mse-term-${j}`} disabled={mv.pending} onPress={() => void tag(t)} />
            ))}
            <Button kind="text" label="Change part" onPress={() => setDomain(null)} />
          </View>
        ) : null}
        <MoveError text={mv.error} />
        {reveal ? <Verdict right={reveal.score >= 1} partial={reveal.score > 0 && reveal.score < 1} title={reveal.score >= 1 ? undefined : `It is ${reveal.answer}`} why={`${reveal.why}${reveal.whyNot ? `\n\nYou picked ${reveal.whyNot}` : ""}`} seed={f} /> : null}
      </View>
    </GameFrame>
  );
}
