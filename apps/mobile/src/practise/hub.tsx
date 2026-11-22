import { router } from "expo-router";
import { ArrowRight, BookOpenCheck, ExternalLink, FileText, Flame as FlameIcon, ListChecks, Lock, Sparkles, Timer, Trophy } from "lucide-react-native";
import * as React from "react";
import { openLink } from "@/lib/open";
import { View } from "react-native";

import { FieldCard, IconDot, Label, Pebbles, QuietEmpty, Row, RowList, Screen, Skeleton, StillTrying, Stone, T } from "@/ds";
import { Enter, Press, ProgressRing, RollingNumber } from "@/motion";
import { toast } from "@/ds/toast";
import { PractiseExtras, WellbeingExtras } from "@/lab/entries";
import { config } from "@/lib/config";
import { SHOWN } from "@/lib/shown";
import { recentPractise, recentPrep } from "@/lib/recent";
import { canGuess, go, prefetchRoute } from "@/api/prefetch";
import { hrefFor } from "@/nav/targets";
import { TabTop } from "@/nav/top";
import { fonts, space, useTheme } from "@/theme";
import { accentFor, AccentProvider } from "./accents";
import { useRead } from "./api";
import { type Icon } from "./catalog";
import type { PractiseHubData, PractiseRow, PrepHome, XpShop } from "./contract";
import { Emblem, loadLine } from "./frame";
import { EntryIcon } from "./icons";

/** The server's row id to the app screen and its icon. */
const APP: Record<string, { href: string; icon: Icon }> = {
  daily: { href: "/case/daily", icon: "sun" },
  detective: { href: "/case/detective", icon: "search" },
  wwyd: { href: "/case/wwyd", icon: "chat" },
  "two-minute": { href: "/case/two-minute", icon: "clock" },
  terms: { href: "/case/say-it", icon: "words" },
  judgment: { href: "/case/judgment", icon: "gauge" },
  ethics: { href: "/ethics", icon: "scale" },
  "out-of-depth": { href: "/case/out-of-depth", icon: "alert" },
  landmark: { href: "/case/landmark", icon: "cap" },
  osce: { href: "/case/osce", icon: "timer" },
  mse: { href: "/case/mse-trainer", icon: "brain" },
  formulation: { href: "/case/formulation", icon: "wand" },
  "weak-spots": { href: "/case/weak-spots", icon: "target" },
  blitz: { href: "/game/blitz", icon: "timer" },
  sort: { href: "/game/sort", icon: "grid" },
  "mse-lab": { href: "/game/mse", icon: "scan" },
  ward: { href: "/game/ward", icon: "hospital" },
  rx: { href: "/game/rx", icon: "pill" },
  duel: { href: "/game/duel", icon: "swords" },
  escape: { href: "/game/escape", icon: "door" },
  comorbid: { href: "/game/comorbid", icon: "layers" },
  prep: { href: "/prep", icon: "list" },
  league: { href: "/game/leaderboard?board=league", icon: "trophy" },
  quiz: { href: "/game/leaderboard?board=quiz", icon: "trophy" },
  overall: { href: "/game/leaderboard?board=overall", icon: "trophy" },
};

/** Where a row opens: the app's own screen, or the website for the few parts that need voice or live peers. */
export function openRow(r: PractiseRow): void {
  if (r.locked) {
    toast.show("This opens soon.");
    return;
  }
  recentPractise.add(r.id);
  const own = APP[r.id];
  if (r.play === "native" && own) {
    router.push(own.href);
    return;
  }
  const href = r.play === "native" ? hrefFor(r.target) : null;
  if (href) go(href);
  else void openLink(`${config.site}${r.target.web}`);
}

/** At most this many rows per group on the hub; the rest is one tap away. */
const PER_GROUP = 4;
const busy = (r: PractiseRow) => r.trailing === "In progress" || r.trailing === "Due";

/**
 * Up to four rows for a hub group: half-done or due first, then what this
 * phone has never opened (new to you), then the rest, each in the server's
 * order. Locked rows go last.
 */
export function pickRows(rows: PractiseRow[], opened: string[], skip: Set<string> = new Set(), n = PER_GROUP): PractiseRow[] {
  const rank = (r: PractiseRow) => (r.locked ? 3 : busy(r) ? 0 : opened.includes(r.id) ? 2 : 1);
  return rows
    .filter((r) => !skip.has(r.id))
    .map((r, i) => ({ r, i }))
    .sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i)
    .slice(0, n)
    .map((x) => x.r);
}

/** A plain list of rows (the boards). */
export function PractiseRows({ rows, testPrefix = "practise" }: { rows: PractiseRow[]; testPrefix?: string }) {
  const c = useTheme();
  return (
    <RowList>
      {rows.map((r) => {
        const own = APP[r.id];
        const trailing = r.locked ? <Lock size={16} color={c.muted} /> : r.play === "web" ? <ExternalLink size={16} color={c.muted} /> : r.trailing ? (
          <T v="caption" tone="muted">
            {r.trailing}
          </T>
        ) : undefined;
        return <Row key={r.id} testID={`${testPrefix}-${r.id}`} title={r.title} meta={r.meta ?? undefined} icon={own ? <IconDot render={(col) => <EntryIcon icon={own.icon} size={18} color={col} />} /> : r.kind === "board" ? <IconDot icon={Trophy} /> : undefined} trailing={trailing} onPress={() => openRow(r)} />;
      })}
    </RowList>
  );
}

/* ------------------------------------------------------------- the ladder */

export type LevelId = "basics" | "apply" | "cases" | "decisions" | "advanced";

/** The five levels, in order: what the student does at each. One path, not a list of tool names. */
export const LEVELS: { id: LevelId; name: string; line: string }[] = [
  { id: "basics", name: "Basics", line: "Terms, criteria and fast facts." },
  { id: "apply", name: "Apply", line: "Name the finding. Tell look-alikes apart." },
  { id: "cases", name: "Cases", line: "Read a whole patient and reason it through." },
  { id: "decisions", name: "Decisions", line: "Choose what to do next, and see what follows." },
  { id: "advanced", name: "Advanced", line: "Perform: out loud, in writing, under uncertainty." },
];

/** Which level each tool and game sits on (by the server's row id). Anything new the server sends lands in Advanced. */
const LEVEL_OF: Record<string, LevelId> = {
  terms: "basics",
  blitz: "basics",
  sort: "basics",
  "mse-lab": "apply",
  duel: "apply",
  rx: "apply",
  detective: "apply",
  comorbid: "apply",
  daily: "cases",
  "two-minute": "cases",
  formulation: "cases",
  escape: "cases",
  landmark: "cases",
  wwyd: "decisions",
  ward: "decisions",
  ethics: "decisions",
  "out-of-depth": "decisions",
  osce: "advanced",
  judgment: "advanced",
  mse: "advanced",
  "weak-spots": "advanced",
};
export const levelOf = (id: string): LevelId => LEVEL_OF[id] ?? "advanced";

/** The hub's rows by level, in the server's order inside each. The daily case leads the screen, so it is left out. */
export function byLevel(s: PractiseHubData): Record<LevelId, PractiseRow[]> {
  const out: Record<LevelId, PractiseRow[]> = { basics: [], apply: [], cases: [], decisions: [], advanced: [] };
  for (const r of [...s.cases, ...s.games]) if (r.id !== "daily") out[levelOf(r.id)].push(r);
  for (const k of Object.keys(out) as LevelId[]) out[k].sort((a, b) => Number(a.locked) - Number(b.locked));
  return out;
}

/** The words for a tile's state, or null. */
function stateWord(r: PractiseRow): string | null {
  if (r.locked) return "Opens soon";
  if (r.trailing === "In progress") return "Half way";
  return r.trailing;
}

/**
 * One tool or game on the hub: a stone with its emblem in its own colour, its
 * name and one line. It grows into the screen it opens and settles back when
 * you return.
 */
export function ToolTile({ row, i = 0, testPrefix = "practise" }: { row: PractiseRow; i?: number; testPrefix?: string }) {
  const c = useTheme();
  const own = APP[row.id];
  const word = stateWord(row);
  const native = row.play === "native" && !row.locked;
  const body = (
    <View style={{ gap: space[3], minHeight: 132, opacity: row.locked ? 0.55 : 1 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Emblem icon={own?.icon ?? "target"} size={44} i={i} />
        {row.locked ? <Lock size={16} color={c.muted} /> : row.play === "web" ? <ExternalLink size={16} color={c.muted} /> : null}
      </View>
      <View style={{ gap: 2 }}>
        <T v="bodyStrong" numberOfLines={2}>
          {row.title}
        </T>
        {word ? (
          <T v="caption" style={{ color: row.locked ? c.muted : c.link, fontFamily: fonts.bold }}>
            {word}
          </T>
        ) : row.meta ? (
          <T v="small" tone="muted" numberOfLines={2}>
            {row.meta}
          </T>
        ) : null}
      </View>
    </View>
  );
  const label = [row.title, word ?? row.meta, row.play === "web" && !row.locked ? "Opens on the website" : null].filter(Boolean).join(". ");
  return (
    <AccentProvider value={accentFor(row.id)}>
      {native ? (
        <Stone grow={() => openRow(row)} accessibilityLabel={label} testID={`${testPrefix}-${row.id}`} style={{ flex: 1 }}>
          {body}
        </Stone>
      ) : (
        <Stone onPress={() => openRow(row)} accessibilityLabel={label} testID={`${testPrefix}-${row.id}`} style={{ flex: 1 }}>
          {body}
        </Stone>
      )}
    </AccentProvider>
  );
}

/** Tiles two to a row, each pair the same height. */
export function TileGrid({ rows, testPrefix }: { rows: PractiseRow[]; testPrefix?: string }) {
  const pairs: PractiseRow[][] = [];
  for (let i = 0; i < rows.length; i += 2) pairs.push(rows.slice(i, i + 2));
  return (
    <View style={{ gap: space[3] }}>
      {pairs.map((p, k) => (
        <View key={p[0]!.id} style={{ flexDirection: "row", gap: space[3], alignItems: "stretch" }}>
          {p.map((r, j) => (
            <ToolTile key={r.id} row={r} i={k * 2 + j} testPrefix={testPrefix} />
          ))}
          {p.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

/** A level's heading: its number in an ink disc, its name and what you do there. */
function LevelHead({ n, name, line }: { n: number; name: string; line: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }} accessible accessibilityRole="header" accessibilityLabel={`Level ${n}, ${name}. ${line}`}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: c.ink, alignItems: "center", justifyContent: "center" }}>
        <T v="small" num style={{ color: c.bg, fontFamily: fonts.bold }}>
          {n}
        </T>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T v="h2">{name}</T>
        <T v="small" tone="muted">
          {line}
        </T>
      </View>
    </View>
  );
}

/** Streak, XP and the board: three numbers on one stone, each a door. */
function Numbers({ shop, rank }: { shop: XpShop | undefined; rank: string | null }) {
  const c = useTheme();
  if (!shop) return null;
  const cell = (testID: string, label: string, a11y: string, onPress: () => void, top: React.ReactNode, icon: React.ReactNode) => (
    <Press testID={testID} accessibilityRole="button" accessibilityLabel={a11y} onPress={onPress} scale={0.96} style={{ flex: 1 }} innerStyle={{ gap: 2, paddingVertical: space[1] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon}
        {top}
      </View>
      <T v="caption" tone="muted">
        {label}
      </T>
    </Press>
  );
  return (
    <Stone testID="hub-numbers">
      <View style={{ flexDirection: "row", gap: space[3] }}>
        {cell("hub-streak", shop.streak.count === 1 ? "day in a row" : "days in a row", `${shop.streak.count} days in a row. Open the XP shop`, () => go("/shop"), <RollingNumber value={shop.streak.count} v="h2" />, <FlameIcon size={18} color={shop.streak.alive ? c.areas.practise.deep : c.muted} />)}
        {cell("hub-xp", "XP to spend", `${shop.balance} XP to spend. Open the XP shop`, () => go("/shop"), <RollingNumber value={shop.balance} v="h2" />, <Sparkles size={18} color={c.areas.me.deep} />)}
        {cell(
          "hub-board",
          "This week's board",
          "This week's board",
          () => go("/game/leaderboard?board=league"),
          <T v="h2" num>
            {rank ?? "Open"}
          </T>,
          <Trophy size={18} color={c.areas.learn.deep} />,
        )}
      </View>
    </Stone>
  );
}

/** Exam prep on the hub: one stone that carries on where you stopped, and three quick doors. */
function PrepBlock({ home, row }: { home: PrepHome | undefined; row: PractiseRow | undefined }) {
  const c = useTheme();
  const open = !!row && !row.locked;
  const resume = home?.resume ? (hrefFor(home.resume.target) ?? `/prep/set?subject=${encodeURIComponent(home.resume.subject)}&topic=${encodeURIComponent(home.resume.topic)}&set=${home.resume.set}`) : null;
  // Practise tab open: the set you would carry on with starts loading, so it opens on its first question.
  React.useEffect(() => {
    if (open && resume && canGuess()) prefetchRoute(resume);
  }, [open, resume]);
  if (!open) return null;
  const total = home?.subjects.reduce((n, x) => n + x.stats.total, 0) ?? 0;
  const answered = home?.subjects.reduce((n, x) => n + x.stats.answered, 0) ?? 0;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  return (
    <View style={{ gap: space[3] }}>
      <Label>Exam prep</Label>
      <Stone
        testID="hub-all-prep"
        accessibilityLabel={home?.resume ? `Carry on: ${home.resume.topicTitle}, ${home.resume.subjectTitle}` : "Question bank. Questions by subject and topic"}
        grow={() => {
          if (home?.resume) recentPrep.add(home.resume.subject);
          go(resume ?? "/prep");
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <ProgressRing pct={pct} size={52} stroke={6} color={c.dark ? c.lime : c.brand} track={c.hairline} label={`${pct} percent of the question bank answered`}>
            <ListChecks size={18} color={c.ink} />
          </ProgressRing>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <T v="h2" numberOfLines={2}>
              {home?.resume ? home.resume.topicTitle : "Question bank"}
            </T>
            <T v="small" tone="muted" numberOfLines={2}>
              {home?.resume ? `Carry on · ${home.resume.subjectTitle} · set ${home.resume.set} of ${home.resume.sets}` : total ? `${answered} of ${total} answered` : "Questions by subject and topic"}
            </T>
          </View>
          <ArrowRight size={20} color={c.ink} />
        </View>
      </Stone>
      <Pebbles
        items={[
          { label: "Subjects", icon: BookOpenCheck, onPress: () => go("/prep"), testID: "hub-prep-subjects" },
          { label: "Mock tests", icon: Timer, onPress: () => go("/prep/mock"), testID: "hub-prep-mock" },
          { label: "Long answers", icon: FileText, onPress: () => go("/prep/long"), testID: "hub-prep-long" },
        ]}
      />
    </View>
  );
}

function HubSkeleton({ failed }: { failed: boolean }) {
  return (
    <View style={{ gap: space[5] }} testID="practise-loading" accessibilityRole="progressbar" accessibilityLabel="Loading Practise">
      <Skeleton h={76} r={26} />
      <Skeleton w="40%" h={24} />
      {[0, 1].map((k) => (
        <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
          <Skeleton h={164} r={26} style={{ flex: 1 }} />
          <Skeleton h={164} r={26} style={{ flex: 1 }} />
        </View>
      ))}
      <StillTrying failed={failed} />
    </View>
  );
}

/**
 * Practise: one hub. Today's patient sits on the field (the one lime thing).
 * On the layer: your streak, XP and board; what you left half way; then one
 * path of five levels (Basics, Apply, Cases, Decisions, Advanced) with every
 * live tool and game on its level; then exam prep and the boards.
 */
export function PractiseHub() {
  const q = useRead<PractiseHubData>("/practise");
  const prep = useRead<PrepHome>("/prep");
  const shop = useRead<XpShop>("/leaderboards/shop");
  const s = q.data;
  const daily = s?.cases.find((r) => r.id === "daily" && !r.locked);
  const solved = daily?.trailing === "Done today";
  const resume = s?.resume ? hrefFor(s.resume.target) : null;
  const field = !s ? null : daily ? (
    <FieldCard live={!solved} title={solved ? "Today's patient is solved" : "Today's patient"} meta={solved ? "A new one comes at midnight." : "Name the diagnosis in as few clues as you can."} action={{ label: solved ? "Practice case" : "Open", onPress: () => router.push(solved ? "/case/daily?mode=practice" : "/case/daily"), testID: "hub-daily" }} />
  ) : s.resume && resume ? (
    <FieldCard title={s.resume.title} meta="Pick up where you left off." action={{ label: "Carry on", onPress: () => router.push(resume), testID: "hub-carry-on" }} />
  ) : null;

  // Pick up again: the last tool (when it is not already on the field) and what is half done, two at most.
  const all = s ? [...s.cases, ...s.games] : [];
  const lastRow = s?.resume ? all.find((r) => r.title === s.resume!.title) : undefined;
  const pick: PractiseRow[] = [];
  if (daily && lastRow && !lastRow.locked) pick.push(lastRow);
  for (const r of all) {
    if (pick.length >= 2) break;
    if (r.id === "daily" || r.locked || r.trailing !== "In progress" || pick.some((p) => p.id === r.id)) continue;
    pick.push(r);
  }
  // Ethics lives in "Read and reason" (with the Casebook, the Lab and the interview), so its tile leaves the levels.
  const ethicsOpen = !!s?.cases.some((r) => r.id === "ethics" && !r.locked);
  const levels = s ? byLevel({ ...s, cases: s.cases.filter((r) => r.id !== "ethics" || r.locked) }) : null;
  const league = s?.boards.find((b) => b.id === "league");
  const empty = s && !s.cases.length && !s.games.length && !s.prep.length;
  let n = 0;
  return (
    <Screen tab area="practise" top={<TabTop />} title="Practise" testID="practise" gap={space[6]} field={field} onRefresh={() => void Promise.all([q.refetch(), prep.refetch(), shop.refetch()])} refreshing={q.isRefetching}>
      {q.isError && q.data === undefined ? (
        <QuietEmpty testID="load-error" title="Practise didn't load" body={loadLine(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
      ) : q.isLoading || !s || !levels ? (
        <HubSkeleton failed={q.failureCount > 0} />
      ) : empty ? (
        <QuietEmpty title="Practise opens soon" body="Your cases and games show up here once they open." />
      ) : (
        <>
          <Enter i={n++}>
            <Numbers shop={shop.data} rank={league?.trailing && /^#?\d+/.test(league.trailing) ? league.trailing : null} />
          </Enter>
          {pick.length ? (
            <Enter i={n++} style={{ gap: space[3] }}>
              <Label>Pick up again</Label>
              {pick.map((r) => (
                <AccentProvider key={r.id} value={accentFor(r.id)}>
                  <Stone grow={() => openRow(r)} testID={`hub-pick-${r.id}`} accessibilityLabel={`${r.title}. ${r.trailing === "In progress" ? "Half way" : "Where you left off"}`}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
                      <Emblem icon={APP[r.id]?.icon ?? "target"} size={52} />
                      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                        <T v="h2" numberOfLines={2}>
                          {r.title}
                        </T>
                        <T v="small" tone="muted">
                          {r.trailing === "In progress" ? "Half way" : "Where you left off"}
                        </T>
                      </View>
                      <ArrowRight size={20} color="transparent" />
                    </View>
                  </Stone>
                </AccentProvider>
              ))}
            </Enter>
          ) : null}
          {LEVELS.map((l, k) =>
            levels[l.id].length ? (
              <Enter key={l.id} i={n++} style={{ gap: space[4] }} testID={`hub-level-${l.id}`}>
                <LevelHead n={k + 1} name={l.name} line={l.line} />
                <TileGrid rows={levels[l.id]} />
                {l.id === "cases" && SHOWN.fullCasePlayer ? (
                  // The full case player on its design sample: shown only in mock builds until the rich cases are connected.
                  <Stone quiet grow={() => router.push("/case/full")} testID="hub-full-case" accessibilityLabel="Full case player. A sample case in the new format">
                    <T v="bodyStrong">Full case player</T>
                    <T v="small" tone="muted">
                      A sample case in the new format: context, hints, graded options.
                    </T>
                  </Stone>
                ) : null}
              </Enter>
            ) : null,
          )}
          <PrepBlock home={prep.data} row={s.prep[0]} />
          <Enter i={n++}>
            <PractiseExtras ethics={ethicsOpen} />
          </Enter>
          {s.boards.length ? (
            <View style={{ gap: space[2] }}>
              <Label>Boards</Label>
              <PractiseRows rows={s.boards} />
            </View>
          ) : null}
          <Enter i={n++}>
            <WellbeingExtras />
          </Enter>
        </>
      )}
    </Screen>
  );
}

const GROUPS: Record<string, string> = { cases: "Cases", games: "Games", boards: "Boards" };

/**
 * One group on its own page: a level of the path (/practise/basics ...), or
 * the older lists the website links to (/practise/cases, /practise/games,
 * /practise/boards). Same tiles as the hub, so it is the same place.
 */
export function PractiseGroup({ group }: { group: string }) {
  const q = useRead<PractiseHubData>("/practise");
  const s = q.data;
  const level = LEVELS.find((l) => l.id === group && !(group in GROUPS));
  const key = level ? level.id : group in GROUPS ? group : "cases";
  const title = level ? level.name : GROUPS[key]!;
  const rows = !s ? [] : key === "boards" ? s.boards : key === "games" ? s.games : key === "cases" && !level ? s.cases : byLevel(s)[key as LevelId];
  return (
    <Screen area="practise" testID={`practise-all-${key}`} title={title} lead={level?.line} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      {q.isError && q.data === undefined ? (
        <QuietEmpty testID="load-error" title={`${title} didn't load`} body={loadLine(q.error)} action={{ label: "Try again", onPress: () => void q.refetch() }} />
      ) : !s ? (
        <HubSkeleton failed={q.failureCount > 0} />
      ) : key === "boards" ? (
        <PractiseRows rows={rows} testPrefix="all" />
      ) : rows.length ? (
        <>
          <TileGrid rows={rows} testPrefix="all" />
          {key === "cases" && !level ? (
            <Stone quiet onPress={() => router.push("/case/library")} testID="hub-library" accessibilityLabel="Every case in one list. What you have done and what is new">
              <T v="bodyStrong">Every case in one list</T>
              <T v="small" tone="muted">
                What you have done and what is new
              </T>
            </Stone>
          ) : null}
        </>
      ) : (
        <QuietEmpty title="Nothing here yet" body="New practice shows up here once it opens." action={{ label: "Back to Practise", onPress: () => router.replace("/practise") }} />
      )}
    </Screen>
  );
}
