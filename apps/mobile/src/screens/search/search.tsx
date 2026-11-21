import { useQueries, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, ChevronLeft, CirclePlay, Clock, Dices, FileText, GraduationCap, Layers, ListTree, MessageCircleQuestionMark, NotebookText, Pill, Search as SearchIcon, Settings, Stethoscope, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotes, useTerms } from "@/api/learn";
import { useOffline } from "@/api/online";
import { courseQuery, useCourses, useDoubts, useLibraryMedicines, useMe, useStudyHome } from "@/api/queries";
import { api } from "@/auth";
import { EmptyState, OfflineLine, Row, RowList, RowsSkeleton, Section, T } from "@/ds";
import { createIndex, normalize, type SearchDoc } from "@/lib/search-engine";
import { recentSearches } from "@/lib/recent";
import { Swap, usePressScale } from "@/motion";
import { useRead } from "@/practise/api";
import { CASE_TOOLS, GAMES_RIVAL, GAMES_SOLO, PREP } from "@/practise/catalog";
import type { PrepHome } from "@/practise/contract";
import Animated from "react-native-reanimated";
import { layout, space, type as scale, useTheme } from "@/theme";
import type { SearchAnswer, SearchType } from "./contract";

type Kind = "lecture" | "file" | "module" | "section" | "note" | "reference" | "medicine" | "doubt" | "game" | "case" | "prep" | "screen";
type Hit = { key: string; title: string; meta?: string; kind: Kind; href: string };
type Doc = SearchDoc & Hit;

const SCREENS: Hit[] = [
  { key: "s-progress", title: "Progress", kind: "screen", href: "/progress" },
  { key: "s-certs", title: "Certificates", kind: "screen", href: "/certificates" },
  { key: "s-journey", title: "My journey, level and badges", kind: "screen", href: "/progress" },
  { key: "s-shop", title: "XP shop", kind: "screen", href: "/shop" },
  { key: "s-saved", title: "Saved bookmarks and notes", kind: "screen", href: "/saved" },
  { key: "s-assignments", title: "Assignments", kind: "screen", href: "/assignments" },
  { key: "s-settings", title: "Settings", kind: "screen", href: "/settings" },
  { key: "s-notifications", title: "Notifications", kind: "screen", href: "/notifications" },
  { key: "s-help", title: "Help", kind: "screen", href: "/help" },
];

const SERVER_KIND: Record<SearchType, Kind | null> = { lecture: "lecture", file: "file", module: "module", section: "section", note: "note", medicine: "medicine", glossary: "reference", case: "case", student: null };

const ICON = { lecture: CirclePlay, file: FileText, module: BookOpen, section: ListTree, note: NotebookText, reference: Layers, medicine: Pill, doubt: MessageCircleQuestionMark, game: Dices, case: Stethoscope, prep: GraduationCap, screen: Settings } as const;

/** Groups, in the order they show. */
const GROUPS: { title: string; kinds: Kind[] }[] = [
  { title: "Lectures", kinds: ["lecture"] },
  { title: "Study", kinds: ["module", "section", "note"] },
  { title: "Quick reference", kinds: ["reference"] },
  { title: "Medicines", kinds: ["medicine"] },
  { title: "Cases", kinds: ["case"] },
  { title: "Games", kinds: ["game"] },
  { title: "Exam Prep", kinds: ["prep"] },
  { title: "Course files", kinds: ["file"] },
  { title: "Doubts", kinds: ["doubt"] },
  { title: "In the app", kinds: ["screen"] },
];

/** At most this many rows in one group. */
const PER_KIND = 6;

/** A shortcut chip: a place to jump to before typing. */
function Shortcut({ name, onPress, testID }: { name: string; onPress: () => void; testID?: string }) {
  const c = useTheme();
  const { style, handlers } = usePressScale(0.94);
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={name} onPress={onPress} {...handlers} style={{ minHeight: layout.target, justifyContent: "center" }}>
      <Animated.View style={[{ minHeight: 40, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 20, borderWidth: 1.5, borderColor: c.cardLine }, style]}>
        <T v="small">{name}</T>
      </Animated.View>
    </Pressable>
  );
}

export function matches(text: string, q: string): boolean {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const t = text.toLowerCase();
  return words.every((w) => t.includes(w));
}

/** The box's hint: only what this account can open. */
export function searchHint(study: boolean, medicines: boolean): string {
  return ["Lectures", study ? "modules" : "doubts", medicines ? "medicines" : null].filter(Boolean).join(", ");
}

/** The start screen's line: what a search looks through, for this account. */
export function searchCovers(open: { study: boolean; medicines: boolean; practise: boolean; games: boolean }): string {
  const parts = ["lectures", ...(open.study ? ["modules", "notes"] : []), ...(open.medicines ? ["medicines"] : []), ...(open.practise ? ["cases"] : []), ...(open.games ? ["games"] : []), ...(open.practise ? ["Exam Prep"] : []), ...(open.study || open.practise ? [] : ["doubts"])];
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0]!;
  return list.charAt(0).toUpperCase() + list.slice(1) + ".";
}

/** `value`, once it has stopped changing for `ms`. */
export function useSettled<T>(value: T, ms: number): T {
  const [settled, setSettled] = React.useState(value);
  React.useEffect(() => {
    if (Object.is(settled, value)) return;
    const t = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(t);
  }, [value, ms, settled]);
  return settled;
}

/**
 * The phone's own matches first (instant, from what is already on the phone,
 * so it works offline), then the server's (the full search: every lecture,
 * topic, note, word and case this account can open). One row per screen.
 */
export function mergeHits(local: readonly Hit[], server: SearchAnswer | undefined): Hit[] {
  const seen = new Set(local.map((h) => h.href));
  const count = new Map<Kind, number>();
  for (const h of local) count.set(h.kind, (count.get(h.kind) ?? 0) + 1);
  const out = [...local];
  for (const r of server?.results ?? []) {
    const kind = SERVER_KIND[r.type];
    if (!kind || seen.has(r.app)) continue;
    const n = count.get(kind) ?? 0;
    if (n >= PER_KIND) continue;
    count.set(kind, n + 1);
    seen.add(r.app);
    out.push({ key: `srv-${r.id}`, title: r.title, meta: r.meta || undefined, kind, href: r.app });
  }
  return out;
}

/** Search across lectures, files, modules, topics, notes, words, medicines, cases, doubts and the app's own screens. */
export function SearchScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  // A link can bring the words with it (vibha://search?q=depression), as can "search for this" from another screen.
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const [q, setQ] = React.useState(() => (Array.isArray(params.q) ? (params.q[0] ?? "") : (params.q ?? "")).slice(0, 80));
  const recent = recentSearches.use();
  const offline = useOffline();
  const me = useMe();
  const can = me.data?.access.can;
  const studyOpen = can?.study !== false && !me.data?.access.lecturesOnly;
  const courses = useCourses();
  // Every course the student has, not only the first.
  const courseList = useQueries({ queries: (courses.data?.courses ?? []).map((x) => courseQuery(x.id)) });
  const weeksKey = courseList.map((r) => r.dataUpdatedAt).join(",");
  const study = useStudyHome(studyOpen);
  const term = q.trim();
  const typing = term.length >= 2;
  const lecturesOnly = !!me.data?.access.lecturesOnly;
  // Lecture-only accounts have no medicines (the server says 403): never ask, never list them.
  const medsOpen = !lecturesOnly && can?.medicines !== false;
  const meds = useLibraryMedicines(typing && medsOpen);
  const doubts = useDoubts(false);
  const notes = useNotes(studyOpen);
  const refs = useTerms(typing && studyOpen);
  const practiseOpen = !lecturesOnly && can?.practice !== false;
  const gamesOpen = !lecturesOnly && can?.games !== false;
  const prep = useRead<PrepHome>("/prep", typing && practiseOpen);

  // The server is asked once typing pauses. Its answers stay on the phone, so a search made before works offline.
  const settled = useSettled(term, 220);
  const askServer = settled.length >= 2 && settled === term;
  const server = useQuery({
    queryKey: ["search", normalize(settled)],
    queryFn: () => api.get<SearchAnswer>("/search", { query: { q: settled } }),
    enabled: askServer && !offline,
    staleTime: 60_000,
    gcTime: 6 * 60 * 60 * 1000,
  });

  // Everything already on the phone, in one typo-tolerant index.
  const index = React.useMemo(() => {
    const docs: Doc[] = [];
    const add = (h: Hit, keywords: string[] = [], boost = 0) => docs.push({ ...h, id: h.key, type: h.kind, keywords, boost });
    const e = encodeURIComponent;
    const seen = new Set<string>();
    for (const r of courseList)
      for (const w of r.data?.weeks ?? []) {
        for (const l of w.lessons)
          if (l.openable && !seen.has(l.id)) {
            seen.add(l.id);
            add({ key: `l-${l.id}`, title: l.title, meta: `Lecture ${l.number} · Week ${w.num}`, kind: "lecture", href: `/lecture/${e(l.id)}` }, [], 3);
          }
        for (const m of w.materials) if (m.openable && !seen.has(m.id)) (seen.add(m.id), add({ key: `f-${m.id}`, title: m.title, meta: m.meta, kind: "file", href: `/material/${e(m.id)}` }));
      }
    // Lecture-only accounts have no Study: its modules opened a closed screen.
    if (studyOpen) for (const m of study.data?.modules ?? []) add({ key: `m-${m.id}`, title: m.title, meta: `Module ${m.num}`, kind: "module", href: `/study/${e(m.id)}` }, [m.tagline], 2);
    if (studyOpen) for (const n of notes.data?.notes ?? []) add({ key: `n-${n.id}`, title: n.title, meta: "Note", kind: "note", href: `/notes/${e(n.id)}` }, [n.tagline], 1);
    if (studyOpen) for (const r of refs.data?.items ?? []) add({ key: `r-${r.slug}`, title: r.label, meta: r.summary, kind: "reference", href: `/reference/${e(r.slug)}` }, r.aliases);
    if (medsOpen) for (const r of meds.data?.rows ?? []) add({ key: `d-${r.id}`, title: r.name, meta: r.cls, kind: "medicine", href: `/medicine/${e(r.id)}` }, [...r.brands, r.cls], 1);
    for (const d of doubts.data?.items ?? []) add({ key: `q-${d.id}`, title: d.title, meta: "Doubt", kind: "doubt", href: `/doubt/${e(d.id)}` }, [d.topic ?? ""]);
    if (gamesOpen) for (const g of [...GAMES_SOLO, ...GAMES_RIVAL]) add({ key: `g-${g.id}`, title: g.title, meta: g.line, kind: "game", href: g.href });
    if (practiseOpen) for (const t of CASE_TOOLS) add({ key: `c-${t.id}`, title: t.title, meta: t.line, kind: "case", href: t.href });
    if (practiseOpen) for (const p of PREP) add({ key: `p-${p.id}`, title: p.title, meta: p.line, kind: "prep", href: p.href }, ["exam prep"]);
    if (practiseOpen) for (const s of prep.data?.subjects ?? []) add({ key: `ps-${s.id}`, title: s.title, meta: "Exam Prep subject", kind: "prep", href: `/prep/${e(s.id)}` });
    for (const s of SCREENS) if ((studyOpen || s.key !== "s-saved") && (!lecturesOnly || s.key !== "s-shop")) add(s);
    return createIndex(docs);
    // weeksKey stands for every course's answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeksKey, study.data, meds.data, doubts.data, studyOpen, notes.data, refs.data, gamesOpen, practiseOpen, prep.data, lecturesOnly, medsOpen]);

  const local: Hit[] = React.useMemo(() => (typing ? index.search(term, { perType: PER_KIND, limit: 80 }).map((h) => ({ key: h.doc.key, title: h.doc.title, meta: h.doc.meta, kind: h.doc.kind, href: h.doc.href })) : []), [index, term, typing]);
  // Server rows only for the words on screen.
  const hits = React.useMemo(() => mergeHits(local, askServer && server.data?.q.toLowerCase() === term.toLowerCase().slice(0, 80) ? server.data : undefined), [local, server.data, askServer, term]);
  const waiting = typing && !hits.length && !offline && (!askServer || server.isFetching);

  const shortcuts = [
    { id: "lectures", name: "Lectures", href: "/lectures", show: can?.lectures !== false },
    { id: "notes", name: "Notes", href: "/notes", show: studyOpen },
    { id: "medicines", name: "Medicines", href: "/library", show: medsOpen },
    { id: "reference", name: "Quick reference", href: "/reference", show: studyOpen },
  ].filter((x) => x.show);
  const open = (href: string) => {
    if (typing) recentSearches.add(term);
    router.push(href);
  };
  const mode = !typing ? "start" : hits.length ? "hits" : waiting ? "wait" : "none";

  return (
    <View testID="search" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], paddingRight: layout.gutter, paddingLeft: space[1], minHeight: 64, borderBottomWidth: 1, borderColor: c.hairline }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={26} color={c.ink} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.target, borderRadius: layout.radius, backgroundColor: c.tint, paddingHorizontal: space[3] }}>
          <SearchIcon size={18} color={c.muted} />
          <TextInput
            testID="search-input"
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder={searchHint(studyOpen, medsOpen)}
            placeholderTextColor={c.muted}
            accessibilityLabel="Search"
            returnKeyType="search"
            onSubmitEditing={() => typing && recentSearches.add(term)}
            autoCorrect={false}
            maxLength={80}
            maxFontSizeMultiplier={1.4}
            style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]}
          />
          {q ? (
            <Pressable testID="search-clear" accessibilityRole="button" accessibilityLabel="Clear the search" onPress={() => setQ("")} hitSlop={4} style={{ width: layout.target - 8, height: layout.target, alignItems: "center", justifyContent: "center" }}>
              <X size={18} color={c.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>
      <OfflineLine />
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: layout.gutter, paddingBottom: insets.bottom + space[6] }}>
        {/* The start screen, results and empty states swap; rows changing as you type do not animate. */}
        <Swap k={mode} style={{ gap: layout.section }}>
          {mode === "start" ? (
            <>
              {shortcuts.length ? (
                <Section title="Go to" quiet>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                    {shortcuts.map((x) => (
                      <Shortcut key={x.id} name={x.name} onPress={() => router.push(x.href)} testID={`shortcut-${x.id}`} />
                    ))}
                  </View>
                </Section>
              ) : null}
              {recent.length ? (
                <Section title="Recent searches" quiet>
                  <RowList still>
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
                </Section>
              ) : (
                <T tone="muted">{searchCovers({ study: studyOpen, medicines: medsOpen, practise: practiseOpen, games: gamesOpen })}</T>
              )}
            </>
          ) : mode === "hits" ? (
            GROUPS.map((g) => {
              const rows = hits.filter((h) => g.kinds.includes(h.kind));
              if (!rows.length) return null;
              return (
                <Section key={g.title} title={g.title} quiet>
                  <RowList still>
                    {rows.map((h) => {
                      const Icon = ICON[h.kind];
                      return <Row key={h.key} testID={`hit-${h.key}`} title={h.title} meta={h.meta} icon={<Icon size={20} color={c.muted} />} onPress={() => open(h.href)} />;
                    })}
                  </RowList>
                </Section>
              );
            })
          ) : mode === "wait" ? (
            <RowsSkeleton rows={4} />
          ) : (
            <EmptyState mood="missing" title="Nothing found" body={offline ? `Nothing on this phone matches "${term}". Search again when you are back online.` : `Nothing matches "${term}". Try a shorter word.`} testID="search-empty" />
          )}
        </Swap>
      </ScrollView>
    </View>
  );
}
