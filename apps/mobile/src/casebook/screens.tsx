import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, Bookmark, BookmarkCheck, Check, X } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import Animated, { LinearTransition, useReducedMotion } from "react-native-reanimated";

import { Button, Chips, HintText, Jyo, Label, OptionList, QuietEmpty, ResultSheet, RoundButton, Stone, T, TabRow, toast } from "@/ds";
import { QuestionRun, type RunResult } from "@/lab/run";
import { seeded, shuffle } from "@/lab/scoring";
import { Page, PlayShell, Tag } from "@/lab/shell";
import { Enter, Press, ProgressRing, RollingNumber, StaggerList, Swap, useMotionTier } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { caseById, CASEBOOK, moduleName, type Case } from "./mock";
import { recordCase, savedCases, useBest } from "./progress";
import { caseSteps, FORMAT_HOW, itemCount, orderRight } from "./steps";
import { FORMAT_LABEL, LEVEL_ORDER, type CaseFormat } from "./types";

type Filter = "all" | CaseFormat;

function CaseCard({ c, best, saved }: { c: Case; best?: { right: number; total: number }; saved: boolean }) {
  const t = useTheme();
  return (
    <Stone testID={`case-${c.id}`} accessibilityLabel={`${c.title}. ${FORMAT_LABEL[c.format]}, ${c.level}${saved ? ", saved" : ""}`} grow={() => router.push(`/casebook/${encodeURIComponent(c.id)}`)}>
      <View style={{ gap: space[2] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
          <Tag>{FORMAT_LABEL[c.format]}</Tag>
          <Tag>{c.level}</Tag>
          <View style={{ flex: 1 }} />
          {saved ? <BookmarkCheck size={18} color={t.ink} /> : null}
          {best ? (
            <T v="caption" tone="muted" num>{`Best ${best.right} of ${best.total}`}</T>
          ) : (
            <ArrowRight size={18} color={t.muted} />
          )}
        </View>
        <T v="h2">{c.title}</T>
        <T v="small" tone="muted">
          {c.hook}
        </T>
      </View>
    </Stone>
  );
}

/** The Casebook: short clinical cases to read and reason through. Browse all of them, or only the ones you saved. */
export function CasebookScreen({ start }: { start?: "browse" | "saved" }) {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = React.useState<"browse" | "saved">(start ?? (params.tab === "saved" ? "saved" : "browse"));
  const [filter, setFilter] = React.useState<Filter>("all");
  const saved = savedCases.use();
  const best = useBest();
  const formats = React.useMemo(() => [...new Set(CASEBOOK.map((c) => c.format))], []);
  const sorted = React.useMemo(() => [...CASEBOOK].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]), []);
  const list = tab === "saved" ? saved.map((id) => caseById(id)).filter((c): c is Case => !!c) : sorted.filter((c) => filter === "all" || c.format === filter);
  const done = Object.keys(best).length;
  return (
    <Page testID="casebook" home="/practise" title="Casebook" lead={done ? `${done} of ${CASEBOOK.length} tried. Read, reason, decide.` : "Short clinical cases. Read, reason, decide."} area="practise">
      <TabRow scroll={false} tabs={[{ id: "browse", name: "All cases" }, { id: "saved", name: saved.length ? `Saved (${saved.length})` : "Saved" }]} value={tab} onChange={setTab} />
      {tab === "browse" ? <Chips scroll label="Kind of case" value={filter} onChange={setFilter} options={[{ id: "all" as Filter, name: "All" }, ...formats.map((f) => ({ id: f as Filter, name: FORMAT_LABEL[f] }))]} /> : null}
      {list.length ? (
        <StaggerList key={`${tab}-${filter}`} style={{ gap: space[3] }}>
          {list.map((c) => (
            <CaseCard key={c.id} c={c} best={best[c.id]} saved={saved.includes(c.id)} />
          ))}
        </StaggerList>
      ) : (
        <QuietEmpty testID="casebook-empty" title="No saved cases yet" body="Open a case and tap the bookmark to keep it here." art={<Jyo pose="resting" size={56} />} action={{ label: "See all cases", onPress: () => setTab("browse") }} />
      )}
    </Page>
  );
}

/** /casebook/saved : the same screen, opened on your saved cases. */
export function SavedCasesScreen() {
  return <CasebookScreen start="saved" />;
}

/** /casebook/:id : the case page (what it is, what you will practise), and its player. */
export function CaseScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const c = caseById(String(id ?? ""));
  const [playing, setPlaying] = React.useState(0);
  const saved = savedCases.use();
  const best = useBest();
  const t = useTheme();
  if (!c)
    return (
      <Page testID="case-missing" home="/casebook" title="Casebook">
        <QuietEmpty title="That case is not here" body="It may have been moved." action={{ label: "All cases", onPress: () => router.replace("/casebook") }} />
      </Page>
    );
  if (playing) return <CasePlayer key={playing} c={c} seed={playing} onClose={() => setPlaying(0)} />;
  const isSaved = saved.includes(c.id);
  const mine = best[c.id];
  const n = itemCount(c);
  const more = CASEBOOK.filter((x) => x.id !== c.id && (x.module === c.module || x.format === c.format)).slice(0, 2);
  return (
    <Page
      testID="case-page"
      home="/casebook"
      title={c.title}
      lead={c.hook}
      area="practise"
      right={
        <RoundButton
          onField
          testID="case-save"
          label={isSaved ? "Remove from saved cases" : "Save this case"}
          onPress={() => {
            if (isSaved) savedCases.remove(c.id);
            else savedCases.add(c.id);
            toast.show(isSaved ? "Removed from saved" : "Saved to your cases");
          }}
        >
          {isSaved ? <BookmarkCheck size={20} color={t.lime} /> : <Bookmark size={20} color={t.onField} />}
        </RoundButton>
      }
      footer={<Button label={mine ? "Play again" : "Start the case"} testID="case-start" onPress={() => setPlaying((mine?.total ?? 0) + Date.now() % 1000 + 1)} />}
    >
      <Enter i={0}>
        <Stone pad={space[5]}>
          <View style={{ gap: space[3] }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
              <Tag>{FORMAT_LABEL[c.format]}</Tag>
              <Tag>{c.level}</Tag>
              <Tag>{moduleName(c.module)}</Tag>
              <Tag>{`${n} ${c.format === "branching" ? "decisions" : c.format === "timeline" ? "events" : "items"}`}</Tag>
            </View>
            <View style={{ gap: space[1] }}>
              <T v="label" tone="muted">
                You will practise
              </T>
              <T v="reading">{c.objective}</T>
            </View>
          </View>
        </Stone>
      </Enter>
      <Enter i={1}>
        <View style={{ gap: space[2] }}>
          <Label>How it works</Label>
          <T style={{ paddingHorizontal: space[1] }}>{FORMAT_HOW[c.format]}</T>
          <T v="small" tone="muted" style={{ paddingHorizontal: space[1] }}>
            The people in these cases are made up. The reasoning is real.
          </T>
        </View>
      </Enter>
      {mine ? (
        <Enter i={2}>
          <Stone>
            <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
              <ProgressRing pct={Math.round((mine.right / Math.max(1, mine.total)) * 100)} size={44} stroke={5} />
              <View style={{ flex: 1 }}>
                <T v="bodyStrong" num>{`Your best: ${mine.right} of ${mine.total}`}</T>
                <T v="small" tone="muted">
                  Kept on this phone
                </T>
              </View>
            </View>
          </Stone>
        </Enter>
      ) : null}
      {more.length ? (
        <Enter i={3}>
          <View style={{ gap: space[2] }}>
            <Label>More like this</Label>
            <View style={{ gap: space[3] }}>
              {more.map((x) => (
                <CaseCard key={x.id} c={x} best={best[x.id]} saved={saved.includes(x.id)} />
              ))}
            </View>
          </View>
        </Enter>
      ) : null}
    </Page>
  );
}

function CasePlayer({ c, seed, onClose }: { c: Case; seed: number; onClose: () => void }) {
  const steps = React.useMemo(() => caseSteps(c, seed), [c, seed]);
  const done = React.useCallback((r: RunResult[]) => recordCase(c.id, r.filter((x) => x.right).length, r.length), [c.id]);
  if (c.format === "branching") return <BranchRun c={c} onClose={onClose} />;
  if (c.format === "timeline") return <TimelineRun c={c} seed={seed} onClose={onClose} />;
  return <QuestionRun testID="case-run" calm title={FORMAT_LABEL[c.format]} steps={steps} onDone={done} takeaway={c.debrief} home={`/casebook/${c.id}`} doneLabel="Back to the case" rightTitle={c.format === "skill" ? "The best reply" : "Yes, that fits"} wrongTitle={c.format === "skill" ? "There is a better reply" : "Not quite"} />;
}

/** A choose-your-path case: one patient, each decision moves the story on. */
function BranchRun({ c, onClose }: { c: Extract<Case, { format: "branching" }>; onClose: () => void }) {
  const [nodeId, setNodeId] = React.useState<string | null>(c.start);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [sheet, setSheet] = React.useState(false);
  const [path, setPath] = React.useState<{ text: string; choice: string; good: boolean; feedback: string }[]>([]);
  const node = c.nodes.find((n) => n.id === nodeId);
  if (!node) {
    const good = path.filter((p) => p.good).length;
    return (
      <PlayShell
        testID="case-summary"
        title={c.title}
        onClose={onClose}
        footer={
<Button label="Back to the case" testID="run-done" onPress={onClose} />
        }
      >
        <Stone pad={space[5]}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: space[1] }}>
            <RollingNumber value={good} v="display" testID="run-score" />
            <T tone="muted" num>{`of ${path.length} decisions held up`}</T>
          </View>
        </Stone>
        {c.debrief ? (
          <View style={{ gap: space[2] }}>
            <Label>Take with you</Label>
            <T v="reading" style={{ paddingHorizontal: space[1] }}>
              {c.debrief}
            </T>
          </View>
        ) : null}
        <View style={{ gap: space[2] }}>
          <Label>Your path</Label>
          <StaggerList style={{ gap: space[2] }}>
            {path.map((p, i) => (
              <Stone key={i}>
                <View style={{ gap: space[1] }}>
                  <T v="caption" tone="muted">{`Decision ${i + 1} · ${p.good ? "Held up" : "Risky"}`}</T>
                  <T v="bodyStrong">{p.choice}</T>
                  <T v="small" tone="muted">
                    {p.feedback}
                  </T>
                </View>
              </Stone>
            ))}
          </StaggerList>
        </View>
      </PlayShell>
    );
  }
  const choice = picked !== null ? node.choices[picked] : undefined;
  const go = () => {
    if (!choice) return;
    const all = [...path, { text: node.text, choice: choice.text, good: choice.good, feedback: choice.feedback }];
    setPath(all);
    setSheet(false);
    setPicked(null);
    setNodeId(choice.next);
    if (!choice.next || !c.nodes.some((n) => n.id === choice.next)) recordCase(c.id, all.filter((p) => p.good).length, all.length);
  };
  const step = c.nodes.findIndex((n) => n.id === node.id);
  return (
    <PlayShell testID="case-run" done={path.length} total={Math.max(c.nodes.length, path.length + 1)} onClose={onClose} footer={<Button label="Decide" testID="run-check" disabled={picked === null || sheet} onPress={() => setSheet(true)} />} over={<ResultSheet open={sheet} right={!!choice?.good} title={choice?.good ? "That holds up" : "That carries a risk"} why={choice?.feedback} action={{ label: "Go on", onPress: go }} />}>
      <Swap k={node.id} dir={1} style={{ gap: space[4] }}>
        <View style={{ gap: space[2] }}>
          <Label>{step <= 0 ? "The case" : "What happens next"}</Label>
          <Stone>
            <T v="reading">{node.text}</T>
          </Stone>
        </View>
        <T v="h2" accessibilityRole="header">
          What do you do?
        </T>
        <OptionList testID="run-options" options={node.choices.map((x) => x.text)} picked={picked} onPick={setPicked} checked={sheet} answer={sheet && choice?.good ? (picked ?? undefined) : sheet ? node.choices.findIndex((x) => x.good) : undefined} />
      </Swap>
    </PlayShell>
  );
}

/** Put the events in order: tap them in the order they happen; tap a placed one to take it back. */
function TimelineRun({ c, seed, onClose }: { c: Extract<Case, { format: "timeline" }>; seed: number; onClose: () => void }) {
  const t = useTheme();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  const move = reduce || low ? undefined : LinearTransition.springify().stiffness(460).damping(38).mass(0.8);
  const correct = c.events.map((e) => e.id);
  const pool = React.useMemo(() => shuffle(c.events, seeded(seed)), [c.events, seed]);
  const [order, setOrder] = React.useState<string[]>([]);
  const [checked, setChecked] = React.useState(false);
  const right = orderRight(correct, order);
  const all = right === correct.length;
  const check = () => {
    setChecked(true);
    recordCase(c.id, right, correct.length);
  };
  const ev = (id: string) => c.events.find((e) => e.id === id)!;
  const left = pool.filter((e) => !order.includes(e.id));
  return (
    <PlayShell
      testID="case-run"
      done={order.length}
      total={correct.length}
      onClose={onClose}
      footer={checked ? <Button kind="ink" label="Back to the case" testID="run-done" onPress={onClose} /> : <Button label="Check the order" testID="run-check" disabled={order.length < correct.length} onPress={check} />}
    >
      <T v="h2" accessibilityRole="header">
        {checked ? (all ? "Yes, that is the order" : `${right} of ${correct.length} in the right place`) : "What happens first?"}
      </T>
      {checked ? (
        <View style={{ gap: space[2] }}>
          <Label>The order it happens in</Label>
          {c.events.map((e, i) => {
            const ok = order[i] === e.id;
            return (
              <Stone key={e.id}>
                <View style={{ flexDirection: "row", gap: space[3] }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: ok ? t.lime : t.missBg, alignItems: "center", justifyContent: "center" }}>{ok ? <Check size={16} color={t.onLime} strokeWidth={3} /> : <X size={16} color={t.ink} strokeWidth={2.5} />}</View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T v="caption" tone="muted">{`${e.when} · ${ok ? "You had this right" : "You had this elsewhere"}`}</T>
                    <T>{e.text}</T>
                  </View>
                </View>
              </Stone>
            );
          })}
          {c.debrief ? <HintText>{c.debrief}</HintText> : null}
        </View>
      ) : (
        <>
          {order.length ? (
            <View style={{ gap: space[2] }}>
              <Label>Your order</Label>
              {order.map((id, i) => (
                <Animated.View key={id} layout={move}>
                  <Press testID={`placed-${id}`} accessibilityRole="button" accessibilityLabel={`${i + 1}. ${ev(id).text}. Tap to take it back`} onPress={() => setOrder((o) => o.filter((x) => x !== id))} scale={0.98} innerStyle={{ flexDirection: "row", gap: space[3], alignItems: "center", minHeight: 52, borderRadius: layout.radius, backgroundColor: t.ink, paddingVertical: space[3], paddingHorizontal: space[4] }}>
                    <T v="bodyStrong" num style={{ color: t.bg }}>
                      {i + 1}
                    </T>
                    <T v="small" style={{ flex: 1, color: t.bg }}>
                      {ev(id).text}
                    </T>
                  </Press>
                </Animated.View>
              ))}
            </View>
          ) : null}
          {left.length ? (
            <View style={{ gap: space[2] }}>
              <Label>{order.length ? "What comes next?" : "Tap them in order"}</Label>
              {left.map((e) => (
                <Animated.View key={e.id} layout={move}>
                  <Press testID={`event-${e.id}`} accessibilityRole="button" accessibilityLabel={e.text} feel="select" onPress={() => setOrder((o) => [...o, e.id])} scale={0.98} innerStyle={{ minHeight: 52, borderRadius: layout.radius, backgroundColor: t.card, paddingVertical: space[3], paddingHorizontal: space[4], justifyContent: "center" }}>
                    <T v="bodyStrong">{e.text}</T>
                  </Press>
                </Animated.View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </PlayShell>
  );
}
