import { Check } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Button, Row, RowList, Section, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { Swap } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { play, useLoad, useMove } from "../api";
import { Draggable, useZones } from "../drag";
import { EndPanel, EndThumb, FrameError, FrameLoading, GameFrame, HudLine, Lives, MoveError, StartScreen, Verdict } from "../frame";
import { useReactions } from "../reactions";
import { SORT_MAX_TRIES, type SortCheck, type SortLoad, type SortReveal, type SortTier, type SortView } from "../types";

const HOW = ["Sixteen cards, four look-alike diagnoses. Each diagnosis has exactly four cards.", "**Drag** a card onto a diagnosis, or tap the card and then tap the diagnosis.", "Tap a diagnosis to see its cards and take one back out.", "When all sixteen are placed, tap **Check**. You have four checks. A diagnosis with three right says **One away**."];

/** Criteria sort: drag sixteen criteria into four look-alike disorders. Checked on the server. */
export function SortGame() {
  const [tier, setTier] = React.useState<SortTier>("basic");
  const [pick, setPick] = React.useState<"daily" | "practice">("daily");
  const [mode, setMode] = React.useState<"daily" | "practice" | null>(null);
  const [nonce, setNonce] = React.useState(0);
  if (!mode)
    return (
      <StartScreen
        testID="sort-start"
        title="Criteria sort"
        line="Sort criteria into look-alike disorders. Four checks to get all sixteen right."
        howTo={HOW}
        choiceLabel="Board"
        choices={[
          { id: "daily", name: "Today's board", line: "The same board for everyone today" },
          { id: "practice", name: "A practice board", line: "A new board each time" },
        ]}
        choice={pick}
        onChoice={setPick}
        onPlay={() => setMode(pick)}
        below={
          <RowList>
            <Row title={tier === "basic" ? "Level: Basic" : "Level: Advanced"} meta={tier === "basic" ? "Sort the cards" : "Sort the cards and pick each diagnosis's rule"} trailing="Change" onPress={() => setTier(tier === "basic" ? "advanced" : "basic")} testID="sort-tier" />
          </RowList>
        }
      />
    );
  return (
    <SortBoardScreen
      key={nonce}
      mode={mode}
      tier={tier}
      again={() => {
        setMode("practice");
        setNonce((x) => x + 1);
      }}
    />
  );
}

function SortBoardScreen({ mode, tier, again }: { mode: "daily" | "practice"; tier: SortTier; again: () => void }) {
  const q = useLoad(() => play<SortLoad>("sort", "load", { mode, tier }), `${mode}:${tier}`);
  if (q.error) return <FrameError title="Criteria sort" error={q.error} onRetry={q.retry} />;
  if (!q.data) return <FrameLoading title="Criteria sort" />;
  return <Board view={q.data.view} again={again} />;
}

function Board({ view, again }: { view: SortView; again: () => void }) {
  const c = useTheme();
  const mv = useMove();
  const react = useReactions();
  const { hit, measure } = useZones();
  const n = view.tiles.length;
  const [place, setPlace] = React.useState<(number | null)[]>(() => Array(n).fill(null));
  const [picks, setPicks] = React.useState<(string | null)[]>([null, null, null, null]);
  const [sel, setSel] = React.useState<number | null>(null);
  const [lifted, setLifted] = React.useState(false);
  const [open, setOpen] = React.useState<number | null>(null);
  const [check, setCheck] = React.useState<SortCheck | null>(null);
  const [done, setDone] = React.useState<SortReveal | null>(view.done);
  const [tries, setTries] = React.useState(view.triesUsed);
  const [rulePick, setRulePick] = React.useState<number | null>(null);
  const locked = (g: number) => !!check?.groupsDone[g];
  const deck = place.map((p, i) => (p === null ? i : -1)).filter((i) => i >= 0);
  const top = sel !== null && place[sel] === null ? sel : (deck[0] ?? null);

  const put = (tile: number, g: number) => {
    if (locked(g)) return false;
    if (place.filter((p) => p === g).length >= 4) return false;
    setPlace((p) => p.map((x, i) => (i === tile ? g : x)));
    setSel(null);
    return true;
  };
  const takeOut = (tile: number) => setPlace((p) => p.map((x, i) => (i === tile ? null : x)));
  const skip = () => {
    if (deck.length < 2 || top === null) return;
    haptic.select();
    const at = deck.indexOf(top);
    setSel(deck[(at + 1) % deck.length]!);
  };

  const submit = async () => {
    const r = await mv.run(() => play<SortCheck>("sort", "check", { mode: view.mode, tier: view.tier, boardId: view.boardId, placement: place, picks, tries: tries + 1 }));
    if (!r) return;
    setCheck(r);
    setTries(r.triesUsed);
    react.answer(r.done?.solved ?? false);
    if (r.done) setDone(r.done);
    else {
      // Cards of groups that are not right go back to the deck, except the "one away" ones.
      setPlace((p) => p.map((g) => (g !== null && !r.groupsDone[g] && !r.oneAway.includes(g) ? null : g)));
    }
  };

  if (done) {
    return (
      <GameFrame testID="game-sort" title={view.title} thumb={<EndThumb again={again} againLabel="Play a practice board" />}>
        <EndPanel kicker={done.solved ? "Board solved" : "Out of checks"} score={String(done.score)} line={done.solved ? `Solved in ${tries} ${tries === 1 ? "check" : "checks"}.` : "Here is where each card belongs."} outcome={done.solved ? (tries <= 2 ? "won" : "mixed") : "lost"}>
          {view.groups.map((g, gi) => (
            <Section key={gi} title={g}>
              <RowList>
                {done.tiles
                  .filter((t) => t.group === gi)
                  .map((t, k) => (
                    <View key={k} style={{ paddingVertical: space[3], gap: 2 }}>
                      <T v="bodyStrong">{t.text}</T>
                      <T v="small" tone="muted">
                        {t.why}
                      </T>
                    </View>
                  ))}
              </RowList>
              {done.thresholds[gi] ? (
                <T v="small" tone="muted">
                  Rule: {done.thresholds[gi]}
                </T>
              ) : null}
            </Section>
          ))}
        </EndPanel>
      </GameFrame>
    );
  }

  const all = deck.length === 0 && (view.tier === "basic" || picks.every(Boolean));
  const hud = (
    <HudLine left={`${n - deck.length} of ${n} placed`} right={<Lives left={SORT_MAX_TRIES - tries} total={SORT_MAX_TRIES} />} />
  );
  return (
    <GameFrame testID="game-sort" title={view.title} howTo={HOW} hud={hud} fixed confirmLeave={tries > 0 || deck.length < n} thumb={<Button label={all ? "Check" : deck.length ? `Place ${deck.length} more` : "Pick each rule"} disabled={!all} busy={mv.pending} onPress={() => void submit()} testID="sort-check" />}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        {view.groups.map((g, gi) => {
          const inBin = place.map((p, i) => (p === gi ? i : -1)).filter((i) => i >= 0);
          const ok = locked(gi);
          const away = !ok && check?.oneAway.includes(gi);
          const target = (sel !== null || lifted) && !ok && inBin.length < 4;
          return (
            <Pressable
              key={gi}
              ref={measure(`g${gi}`)}
              accessibilityRole="button"
              accessibilityLabel={`${g}, ${inBin.length} of 4${ok ? ", right" : ""}`}
              testID={`sort-bin-${gi}`}
              onPress={() => {
                // A tap on an empty diagnosis with a card showing puts that card there:
                // there is nothing in it to see, so opening it would be a dead end.
                const card = sel ?? (inBin.length === 0 ? top : null);
                if (card !== null) {
                  if (put(card, gi)) haptic.success();
                } else setOpen(gi);
              }}
              style={({ pressed }) => ({ width: "48.5%", minHeight: 112, padding: space[3], gap: space[2], borderRadius: layout.radius, borderWidth: target ? 2 : 1.5, borderStyle: target ? "dashed" : "solid", borderColor: ok ? (c.dark ? c.primary : c.ink) : target ? c.accent : c.cardLine, backgroundColor: ok ? c.successBg : pressed ? c.tint : c.card })}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: space[1] }}>
                <T v="small" style={{ flex: 1, fontWeight: "700" }} numberOfLines={3}>
                  {g}
                </T>
                {ok ? <Check size={16} color={c.ink} /> : null}
              </View>
              <View style={{ flexDirection: "row", gap: 3 }}>
                {[0, 1, 2, 3].map((k) => (
                  <View key={k} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: k < inBin.length ? (ok ? c.ink : c.accent) : c.fieldLine }} />
                ))}
              </View>
              {away ? (
                <T v="caption" tone="link" testID={`sort-away-${gi}`}>
                  ONE AWAY
                </T>
              ) : null}
              {view.thresholds ? (
                <T v="caption" tone={picks[gi] ? "ink" : "link"} onPress={() => setRulePick(gi)} suppressHighlighting>
                  {picks[gi] ? `Rule: ${picks[gi]}` : "Pick the rule"}
                </T>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      <View style={{ flex: 1, justifyContent: "center", gap: space[3] }}>
        {top !== null ? (
          <Swap k={top} style={{ gap: space[3] }}>
            <Draggable onDrop={(x, y) => { const z = hit(x, y); return z ? put(top, Number(z.slice(1))) : false; }} onLift={setLifted} testID="sort-card">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Card: ${view.tiles[top]}. ${sel === top ? "Selected. Now tap a diagnosis." : "Tap to pick it up."}`}
                onPress={() => {
                  haptic.select();
                  setSel(sel === top ? null : top);
                }}
                testID={`sort-tile-${top}`}
                style={{ minHeight: 120, padding: space[5], justifyContent: "center", borderRadius: layout.radius, borderWidth: 2, borderColor: sel === top ? c.accent : c.ink, backgroundColor: c.card }}
              >
                <T v="h3" center>
                  {view.tiles[top]}
                </T>
              </Pressable>
            </Draggable>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <T v="small" tone="muted">
                {sel === top ? "Now tap a diagnosis" : "Drag it to a diagnosis"}
              </T>
              {deck.length > 1 ? <Button kind="text" label="Next card" onPress={skip} testID="sort-skip" /> : null}
            </View>
          </Swap>
        ) : (
          <Verdict right title="All sixteen placed" why={view.tier === "advanced" && !picks.every(Boolean) ? "Pick a rule for each diagnosis, then check." : "Check when you are ready. Tap a diagnosis to move a card."} />
        )}
        {check && !check.done ? <Verdict right={false} title={`${check.groupsDone.filter(Boolean).length} of 4 right`} why={check.oneAway.length ? "One away means three of its four cards are right." : "The cards that were not right are back in the deck."} seed={tries} /> : null}
        <MoveError text={mv.error} />
      </View>
      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open !== null ? view.groups[open] : undefined}>
        {open !== null ? (
          <RowList>
            {place
              .map((p, i) => (p === open ? i : -1))
              .filter((i) => i >= 0)
              .map((i) => (
                <Row key={i} title={view.tiles[i]!} trailing={locked(open) ? undefined : "Take out"} onPress={locked(open) ? undefined : () => takeOut(i)} chevron={false} />
              ))}
          </RowList>
        ) : null}
        {open !== null && !place.includes(open) ? (
          <T tone="muted">No cards here yet.</T>
        ) : null}
      </Sheet>
      <Sheet open={rulePick !== null} onClose={() => setRulePick(null)} title="Pick the rule">
        <ScrollView>
          <RowList>
            {(view.thresholds ?? []).map((t) => (
              <Row key={t} title={t} onPress={() => { setPicks((p) => p.map((x, k) => (k === rulePick ? t : x))); setRulePick(null); }} chevron={false} />
            ))}
          </RowList>
        </ScrollView>
      </Sheet>
    </GameFrame>
  );
}
