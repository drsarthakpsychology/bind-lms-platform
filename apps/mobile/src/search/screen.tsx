import { useQueries, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, BookA, CirclePlay, Clock, Dices, HeartPulse, NotebookText, Pill, Search as SearchIcon, Settings, Stethoscope, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/auth";
import { useNotes, useTerms } from "@/api/learn";
import { useOffline } from "@/api/online";
import { courseQuery, useCourses, useLibraryMedicines, useMe, useStudyHome } from "@/api/queries";
import { Chips, Label, OfflineLine, QuietEmpty, RoundButton, Row, RowList, Skeleton, T, layerShadow } from "@/ds";
import { CALM_TOOLS } from "@/calm/data";
import { FORMAT_LABEL } from "@/casebook/types";
import { useCasebook, useLabHome, type Case } from "@/lab/data";
import type { LabExperiment } from "@/lab/types";
import { leave, OwnHeader, type IconType } from "@/lab/shell";
import { recentSearches } from "@/lib/recent";
import { Press, presets, useMotionTier } from "@/motion";
import { CASE_TOOLS, GAMES_RIVAL, GAMES_SOLO, PREP } from "@/practise/catalog";
import { INSTRUMENTS } from "@/selfcheck/tests";
import { layout, space, type as scale, useLightStatusBar, useTheme } from "@/theme";
import Animated, { useReducedMotion } from "react-native-reanimated";
import type { SearchAnswer, SearchType } from "./contract";
import { createIndex, type SearchDoc } from "./engine";

/**
 * Search everything from one box (the search button in the top bar and the
 * search field on Notes both open this screen).
 *
 * Typing never waits for anything: the letters go straight into the box, and
 * the list is worked out from what is already on the phone, at low priority
 * (`useDeferredValue`), with the website's typo-tolerant engine. The server's
 * fuller search (GET /search) is asked once typing has paused and its rows are
 * added under the phone's own. With no internet the phone's rows are the answer.
 */

export type Group = "lessons" | "notes" | "medicines" | "cases" | "words" | "practise" | "calm" | "app";
export type Doc = SearchDoc & { type: Group; href: string; key: string };

export const GROUPS: { id: Group; name: string; icon: IconType }[] = [
  { id: "lessons", name: "Lessons", icon: CirclePlay },
  { id: "notes", name: "Notes", icon: NotebookText },
  { id: "medicines", name: "Medicines", icon: Pill },
  { id: "cases", name: "Cases", icon: Stethoscope },
  { id: "words", name: "Words", icon: BookA },
  { id: "practise", name: "Practise", icon: Dices },
  { id: "calm", name: "Calm and self-checks", icon: HeartPulse },
  { id: "app", name: "In the app", icon: Settings },
];
const ORDER = GROUPS.map((g) => g.id);
const PER_GROUP = 6;

const SERVER_GROUP: Partial<Record<SearchType, Group>> = { lecture: "lessons", file: "lessons", module: "lessons", section: "lessons", note: "notes", medicine: "medicines", glossary: "words", case: "cases" };

const doc = (type: Group, key: string, title: string, href: string, meta?: string, keywords?: string[], boost?: number): Doc => ({ id: key, key, type, title, href, meta, keywords, boost });

/** Things that are always on the phone: the practise tools, the Lab, the Casebook, calm, self-checks and the app's own screens. */
export function fixedDocs(open: { practise: boolean; games: boolean; study: boolean; lecturesOnly: boolean }, CASEBOOK: readonly Case[] = [], EXPERIMENTS: readonly LabExperiment[] = []): Doc[] {
  const out: Doc[] = [];
  if (open.practise) {
    for (const t of CASE_TOOLS) out.push(doc("cases", `c-${t.id}`, t.title, t.id === "ethics" ? "/ethics" : t.href, t.line));
    for (const x of CASEBOOK) out.push(doc("cases", `cb-${x.id}`, x.title, `/casebook/${x.id}`, `Casebook · ${FORMAT_LABEL[x.format]}`, [x.hook, x.module]));
    out.push(doc("cases", "s-casebook", "Casebook", "/casebook", "Short clinical cases to read and reason through", ["cases", "saved cases"], 2));
    for (const p of PREP) out.push(doc("practise", `p-${p.id}`, p.title, p.href, "Exam Prep", [p.line, "exam prep"]));
    out.push(doc("practise", "p-interview", "Mock interview", "/interview", "Five questions, the way a panel asks them", ["interview", "panel", "viva"]));
    out.push(doc("practise", "s-lab", "Psychology Lab", "/lab", "Run classic experiments on yourself", ["experiments", "lab"], 2));
    for (const e of EXPERIMENTS) out.push(doc("practise", `x-${e.id}`, e.title, `/lab/${e.id}`, `Lab · ${e.area}`, [e.hook, e.area]));
  }
  if (open.games) for (const g of [...GAMES_SOLO, ...GAMES_RIVAL]) out.push(doc("practise", `g-${g.id}`, g.title, g.href, g.line));
  out.push(doc("calm", "s-calm", "Calm", "/calm", "Breathing, grounding and more", ["relax", "anxiety", "panic", "stress"], 2));
  for (const t of CALM_TOOLS) out.push(doc("calm", `k-${t.id}`, t.title, `/calm/${t.id}`, t.minutes, [t.text]));
  out.push(doc("calm", "s-selfcheck", "Self-checks", "/selfcheck", "Short questionnaires, scored on your phone", ["test", "questionnaire", "screening"]));
  for (const x of INSTRUMENTS) out.push(doc("calm", `t-${x.id}`, x.short, `/selfcheck/${x.id}`, `${x.name} · ${x.minutes} min`, [x.name, x.measures]));
  const screens: [string, string, string][] = [
    ["s-progress", "Progress", "/progress"],
    ["s-certs", "Certificates", "/certificates"],
    ["s-journey", "My journey, level and badges", "/progress"],
    ["s-assignments", "Assignments", "/assignments"],
    ["s-settings", "Settings", "/settings"],
    ["s-notifications", "Notifications", "/notifications"],
    ["s-help", "Help", "/help"],
    ["s-doubts", "Doubts", "/doubts"],
  ];
  if (open.study) screens.push(["s-saved", "Saved bookmarks and notes", "/saved"]);
  if (!open.lecturesOnly) screens.push(["s-shop", "XP shop", "/shop"]);
  for (const [key, title, href] of screens) out.push(doc("app", key, title, href));
  return out;
}

/** The phone's rows first, then the server's that the phone did not already have. One row per screen. */
export function mergeServer(local: readonly Doc[], server: SearchAnswer | undefined): Doc[] {
  const seen = new Set(local.map((d) => d.href));
  const count = new Map<Group, number>();
  for (const d of local) count.set(d.type, (count.get(d.type) ?? 0) + 1);
  const out = [...local];
  for (const r of server?.results ?? []) {
    const g = SERVER_GROUP[r.type];
    if (!g || !r.app || seen.has(r.app)) continue;
    const n = count.get(g) ?? 0;
    if (n >= PER_GROUP) continue;
    count.set(g, n + 1);
    seen.add(r.app);
    out.push(doc(g, `srv-${r.id}`, r.title, r.app, r.meta || undefined));
  }
  return out;
}

/** `value`, once it has stopped changing for `ms`. */
function useSettled<T>(value: T, ms: number): T {
  const [settled, setSettled] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return settled;
}

type Filter = "all" | Group;

export function SearchScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { low } = useMotionTier();
  useLightStatusBar(true);
  // A link can bring the words with it (vibha://search?q=depression).
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const [q, setQ] = React.useState(() => (Array.isArray(params.q) ? (params.q[0] ?? "") : (params.q ?? "")).slice(0, 80));
  const [filter, setFilter] = React.useState<Filter>("all");
  const input = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const recent = recentSearches.use();
  const offline = useOffline();

  const me = useMe();
  const can = me.data?.access.can;
  const lecturesOnly = !!me.data?.access.lecturesOnly;
  const studyOpen = can?.study !== false && !lecturesOnly;
  const medsOpen = !lecturesOnly && can?.medicines !== false;
  const practiseOpen = !lecturesOnly && can?.practice !== false;
  const gamesOpen = !lecturesOnly && can?.games !== false;

  // What is already on the phone (the same queries the tabs use, so they are usually loaded).
  const courses = useCourses();
  const courseList = useQueries({ queries: (courses.data?.courses ?? []).map((x) => courseQuery(x.id)) });
  const weeksKey = courseList.map((r) => r.dataUpdatedAt).join(",");
  const study = useStudyHome(studyOpen);
  const notes = useNotes(studyOpen);
  const terms = useTerms(studyOpen);
  const meds = useLibraryMedicines(medsOpen);
  // The Lab and the Casebook are on the server: their titles join once loaded (failures leave them out quietly).
  const lab = useLabHome(practiseOpen);
  const casebook = useCasebook(practiseOpen);

  const index = React.useMemo(() => {
    const e = encodeURIComponent;
    const docs: Doc[] = [];
    const seen = new Set<string>();
    for (const r of courseList)
      for (const w of r.data?.weeks ?? [])
        for (const l of w.lessons)
          if (l.openable && !seen.has(l.id)) {
            seen.add(l.id);
            docs.push(doc("lessons", `l-${l.id}`, l.title, `/lecture/${e(l.id)}`, `Lecture ${l.number} · Week ${w.num}`));
          }
    if (studyOpen) for (const m of study.data?.modules ?? []) docs.push(doc("lessons", `m-${m.id}`, m.title, `/study/${e(m.id)}`, `Module ${m.num}`, [m.tagline]));
    if (studyOpen) for (const n of notes.data?.notes ?? []) docs.push(doc("notes", `n-${n.id}`, n.title, `/notes/${e(n.id)}`, n.tagline || "Note"));
    if (studyOpen) for (const r of terms.data?.items ?? []) docs.push(doc("words", `r-${r.slug}`, r.label, `/reference/${e(r.slug)}`, r.summary, r.aliases));
    if (medsOpen) for (const r of meds.data?.rows ?? []) docs.push(doc("medicines", `d-${r.id}`, r.name, `/medicine/${e(r.id)}`, r.cls, [...r.brands, r.group, ...r.uses]));
    docs.push(...fixedDocs({ practise: practiseOpen, games: gamesOpen, study: studyOpen, lecturesOnly }, casebook.data?.cases, lab.data?.experiments));
    return createIndex(docs);
    // weeksKey stands for every course's answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeksKey, study.data, notes.data, terms.data, meds.data, lab.data, casebook.data, studyOpen, medsOpen, practiseOpen, gamesOpen, lecturesOnly]);

  // The list follows the box at low priority: a slow search never holds a key press.
  const term = React.useDeferredValue(q).trim();
  const typing = term.length >= 2;
  const local = React.useMemo(() => (typing ? index.search(term, { perType: PER_GROUP, limit: 60 }).map((h) => h.doc) : []), [index, term, typing]);

  // The server's fuller search, once typing has paused. A failure (or no such route yet) just leaves the phone's rows.
  const asked = useSettled(term, 280);
  const server = useQuery({
    queryKey: ["search", asked],
    queryFn: () => api.get<SearchAnswer>(`/search?q=${encodeURIComponent(asked)}&perType=${PER_GROUP}`),
    enabled: asked.length >= 2 && !offline,
    staleTime: 60_000,
    retry: false,
  });
  const hits = React.useMemo(() => mergeServer(local, asked === term ? server.data : undefined), [local, server.data, asked, term]);
  const waiting = typing && !hits.length && (asked !== term || server.isFetching || courses.isLoading);

  const present = GROUPS.filter((g) => hits.some((h) => h.type === g.id));
  const shown = filter === "all" || !present.some((g) => g.id === filter) ? present : present.filter((g) => g.id === filter);
  const open = (href: string) => {
    if (q.trim().length >= 2) recentSearches.add(q.trim());
    router.push(href);
  };
  const shortcuts = [
    { id: "lectures", name: "Lectures", href: "/lectures", show: can?.lectures !== false },
    { id: "notes", name: "Notes", href: "/notes", show: studyOpen },
    { id: "medicines", name: "Medicines", href: "/medicines", show: medsOpen },
    { id: "reference", name: "Quick reference", href: "/reference", show: studyOpen },
    { id: "casebook", name: "Casebook", href: "/casebook", show: practiseOpen },
    { id: "lab", name: "Psychology Lab", href: "/lab", show: practiseOpen },
    { id: "calm", name: "Calm", href: "/calm", show: true },
  ].filter((x) => x.show);

  return (
    <View testID="search" style={{ flex: 1, backgroundColor: c.field, paddingTop: insets.top }}>
      <OwnHeader kind="overlay" />
      {/* On the field: back, and the one box. */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], paddingHorizontal: layout.gutter, paddingTop: space[2], paddingBottom: space[4] }}>
        <RoundButton onField label="Back" testID="back" onPress={() => leave("/home")}>
          <ArrowLeft size={20} color={c.onField} />
        </RoundButton>
        <Pressable accessible={false} onPress={() => input.current?.focus()} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: space[2], minHeight: 52, borderRadius: 26, backgroundColor: c.fieldTint, paddingLeft: space[4], paddingRight: space[1] }}>
          <SearchIcon size={18} color={c.onField} />
          <TextInput
            ref={input}
            testID="search-input"
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="Lessons, notes, medicines, cases, words"
            placeholderTextColor={c.onFieldMuted}
            selectionColor={c.lime}
            accessibilityLabel="Search"
            returnKeyType="search"
            onSubmitEditing={() => q.trim().length >= 2 && recentSearches.add(q.trim())}
            autoCorrect={false}
            autoCapitalize="none"
            maxLength={80}
            maxFontSizeMultiplier={1.4}
            style={[scale.body, { flex: 1, color: c.onField, minHeight: layout.target }, { outlineStyle: "none" } as object]}
          />
          {q ? (
            <Pressable testID="search-clear" accessibilityRole="button" accessibilityLabel="Clear the search" onPress={() => { setQ(""); input.current?.focus(); }} hitSlop={4} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <X size={18} color={c.onField} />
            </Pressable>
          ) : null}
        </Pressable>
      </View>
      <OfflineLine />
      <Animated.View testID="layer" entering={reduce ? undefined : presets.layer(low)} style={{ flex: 1, backgroundColor: c.bg, borderTopLeftRadius: layout.radiusLayer, borderTopRightRadius: layout.radiusLayer, overflow: "hidden", ...layerShadow(c) }}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: layout.gutter, paddingTop: space[5], gap: space[5], paddingBottom: insets.bottom + space[6], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
          {!typing ? (
            <>
              <View style={{ gap: space[2] }}>
                <Label>Go to</Label>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                  {shortcuts.map((x) => (
                    <Press key={x.id} testID={`shortcut-${x.id}`} accessibilityRole="button" accessibilityLabel={x.name} onPress={() => router.push(x.href)} scale={0.94} style={{ minHeight: layout.target, justifyContent: "center" }} innerStyle={{ minHeight: 40, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 20, backgroundColor: c.card }}>
                      <T v="small">{x.name}</T>
                    </Press>
                  ))}
                </View>
              </View>
              {recent.length ? (
                <View style={{ gap: space[2] }}>
                  <Label>Recent searches</Label>
                  <RowList still bare>
                    {recent.map((r) => (
                      <View key={r} style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flex: 1 }}>
                          <Row testID={`recent-${r}`} title={r} icon={<Clock size={20} color={c.muted} />} chevron={false} onPress={() => setQ(r)} />
                        </View>
                        <Pressable testID={`recent-remove-${r}`} accessibilityRole="button" accessibilityLabel={`Remove ${r} from recent searches`} onPress={() => recentSearches.remove(r)} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
                          <X size={18} color={c.muted} />
                        </Pressable>
                      </View>
                    ))}
                  </RowList>
                </View>
              ) : (
                <T tone="muted" testID="search-covers">
                  One box for everything: a lesson, a note, a medicine or its brand name, a case, a word. Small spelling slips are fine.
                </T>
              )}
            </>
          ) : hits.length ? (
            <>
              {present.length > 1 ? <Chips scroll label="Show" value={filter === "all" || present.some((g) => g.id === filter) ? filter : "all"} onChange={setFilter} options={[{ id: "all" as Filter, name: "All" }, ...present.map((g) => ({ id: g.id as Filter, name: g.name }))]} /> : null}
              {shown.map((g) => {
                const rows = hits.filter((h) => h.type === g.id);
                return (
                  <View key={g.id} testID={`group-${g.id}`} style={{ gap: space[2] }}>
                    <Label>{g.name}</Label>
                    <RowList still bare>
                      {rows.map((h) => (
                        <Row key={h.key} testID={`hit-${h.key}`} title={h.title} meta={h.meta} icon={<g.icon size={20} color={c.muted} />} onPress={() => open(h.href)} />
                      ))}
                    </RowList>
                  </View>
                );
              })}
            </>
          ) : waiting ? (
            <View testID="search-waiting" style={{ gap: space[4] }}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
                  <Skeleton w={36} h={36} r={18} />
                  <View style={{ flex: 1, gap: space[2] }}>
                    <Skeleton w={i % 2 ? "55%" : "70%"} h={14} />
                    <Skeleton w="40%" h={10} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <QuietEmpty testID="search-empty" title="Nothing found" body={offline ? `Nothing on this phone matches "${term}". The full search needs the internet.` : `Nothing matches "${term}". Try a shorter word, or another name for it.`} />
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
