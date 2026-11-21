import { useQueries } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, ChevronLeft, CirclePlay, Clock, Dices, GraduationCap, Layers, MessageCircleQuestionMark, NotebookText, Pill, Search as SearchIcon, Settings, Stethoscope, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotes, useTerms } from "@/api/learn";
import { searchRefs } from "@/screens/reference/reference";
import { courseQuery, useCourses, useDoubts, useLibraryMedicines, useMe, useStudyHome } from "@/api/queries";
import { EmptyState, OfflineLine, Row, RowList, Section, T } from "@/ds";
import { recentSearches } from "@/lib/recent";
import { usePressScale } from "@/motion";
import { useRead } from "@/practise/api";
import { CASE_TOOLS, GAMES_RIVAL, GAMES_SOLO, PREP } from "@/practise/catalog";
import type { PrepHome } from "@/practise/contract";
import Animated from "react-native-reanimated";
import { layout, space, type as scale, useTheme } from "@/theme";

type Hit = { key: string; title: string; meta?: string; kind: "lecture" | "module" | "note" | "reference" | "medicine" | "doubt" | "game" | "case" | "prep" | "screen"; href: string };

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

/** Search across lectures, modules, medicines, doubts and the app's own screens. */
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

export function SearchScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  // A link can bring the words with it (vibha://search?q=depression), as can "search for this" from another screen.
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const [q, setQ] = React.useState(() => (Array.isArray(params.q) ? (params.q[0] ?? "") : (params.q ?? "")).slice(0, 80));
  const recent = recentSearches.use();
  const me = useMe();
  const can = me.data?.access.can;
  const studyOpen = can?.study !== false && !me.data?.access.lecturesOnly;
  const courses = useCourses();
  // Every course the student has, not only the first.
  const courseList = useQueries({ queries: (courses.data?.courses ?? []).map((x) => courseQuery(x.id)) });
  const weeks = courseList.flatMap((r) => r.data?.weeks ?? []);
  const weeksKey = courseList.map((r) => r.dataUpdatedAt).join(",");
  const study = useStudyHome(studyOpen);
  const term = q.trim();
  const lecturesOnly = !!me.data?.access.lecturesOnly;
  // Lecture-only accounts have no medicines (the server says 403): never ask, never list them.
  const medsOpen = !lecturesOnly && can?.medicines !== false;
  const meds = useLibraryMedicines(term.length >= 2 && medsOpen);
  const doubts = useDoubts(false);
  const notes = useNotes(studyOpen);
  const refs = useTerms(term.length >= 2 && studyOpen);
  const practiseOpen = !lecturesOnly && can?.practice !== false;
  const gamesOpen = !lecturesOnly && can?.games !== false;
  const prep = useRead<PrepHome>("/prep", term.length >= 2 && practiseOpen);

  const hits: Hit[] = React.useMemo(() => {
    if (term.length < 2) return [];
    const out: Hit[] = [];
    const seen = new Set<string>();
    const e = encodeURIComponent;
    for (const w of weeks)
      for (const l of w.lessons)
        if (l.openable && !seen.has(l.id) && matches(l.title, term)) {
          seen.add(l.id);
          out.push({ key: `l-${l.id}`, title: l.title, meta: `Lecture ${l.number} · Week ${w.num}`, kind: "lecture", href: `/lecture/${e(l.id)}` });
        }
    // Lecture-only accounts have no Study: its modules opened a closed screen.
    if (studyOpen) for (const m of study.data?.modules ?? []) if (matches(`${m.title} ${m.tagline}`, term)) out.push({ key: `m-${m.id}`, title: m.title, meta: `Module ${m.num}`, kind: "module", href: `/study/${e(m.id)}` });
    if (studyOpen) for (const n of notes.data?.notes ?? []) if (matches(`${n.title} ${n.tagline}`, term)) out.push({ key: `n-${n.id}`, title: n.title, meta: "Note", kind: "note", href: `/notes/${e(n.id)}` });
    if (studyOpen) for (const r of searchRefs(refs.data?.items ?? [], term).slice(0, 6)) out.push({ key: `r-${r.slug}`, title: r.label, meta: r.summary, kind: "reference", href: `/reference/${e(r.slug)}` });
    if (medsOpen) for (const r of (meds.data?.rows ?? []).filter((x) => matches(`${x.name} ${x.brands.join(" ")} ${x.cls}`, term)).slice(0, 6)) out.push({ key: `d-${r.id}`, title: r.name, meta: r.cls, kind: "medicine", href: `/medicine/${e(r.id)}` });
    for (const d of doubts.data?.items ?? []) if (matches(`${d.title} ${d.topic ?? ""}`, term)) out.push({ key: `q-${d.id}`, title: d.title, meta: "Doubt", kind: "doubt", href: `/doubt/${e(d.id)}` });
    if (gamesOpen) for (const g of [...GAMES_SOLO, ...GAMES_RIVAL]) if (matches(`${g.title} ${g.line}`, term)) out.push({ key: `g-${g.id}`, title: g.title, meta: g.line, kind: "game", href: g.href });
    if (practiseOpen) for (const t of CASE_TOOLS) if (matches(`${t.title} ${t.line}`, term)) out.push({ key: `c-${t.id}`, title: t.title, meta: t.line, kind: "case", href: t.href });
    if (practiseOpen) for (const p of PREP) if (matches(`${p.title} ${p.line} exam prep`, term)) out.push({ key: `p-${p.id}`, title: p.title, meta: "Exam Prep", kind: "prep", href: p.href });
    if (practiseOpen) for (const s of prep.data?.subjects ?? []) if (matches(s.title, term)) out.push({ key: `ps-${s.id}`, title: s.title, meta: "Exam Prep subject", kind: "prep", href: `/prep/${e(s.id)}` });
    for (const s of SCREENS) if (matches(s.title, term) && (studyOpen || s.key !== "s-saved") && (!lecturesOnly || s.key !== "s-shop")) out.push(s);
    return out;
    // weeksKey stands for every course's answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, weeksKey, study.data, meds.data, doubts.data, can, studyOpen, notes.data, refs.data, gamesOpen, practiseOpen, prep.data, lecturesOnly, medsOpen]);

  const shortcuts = [
    { id: "lectures", name: "Lectures", href: "/lectures", show: can?.lectures !== false },
    { id: "notes", name: "Notes", href: "/notes", show: studyOpen },
    { id: "medicines", name: "Medicines", href: "/medicines", show: medsOpen },
    { id: "reference", name: "Quick reference", href: "/reference", show: studyOpen },
  ].filter((x) => x.show);
  const open = (href: string) => {
    if (term.length >= 2) recentSearches.add(term);
    router.push(href);
  };

  const ICON = { lecture: CirclePlay, module: BookOpen, note: NotebookText, reference: Layers, medicine: Pill, doubt: MessageCircleQuestionMark, game: Dices, case: Stethoscope, prep: GraduationCap, screen: Settings } as const;
  const groups: { title: string; kinds: Hit["kind"][] }[] = [
    { title: "Lectures", kinds: ["lecture"] },
    { title: "Study", kinds: ["module", "note"] },
    { title: "Quick reference", kinds: ["reference"] },
    { title: "Medicines", kinds: ["medicine"] },
    { title: "Practise", kinds: ["case", "game"] },
    { title: "Exam Prep", kinds: ["prep"] },
    { title: "Doubts", kinds: ["doubt"] },
    { title: "In the app", kinds: ["screen"] },
  ];

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
            onSubmitEditing={() => term.length >= 2 && recentSearches.add(term)}
            autoCorrect={false}
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
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: layout.gutter, gap: layout.section, paddingBottom: insets.bottom + space[6] }}>
        {term.length < 2 ? (
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
        ) : hits.length ? (
          groups.map((g) => {
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
        ) : (
          <EmptyState mood="missing" title="Nothing found" body={`Nothing matches "${term}". Try a shorter word.`} testID="search-empty" />
        )}
      </ScrollView>
    </View>
  );
}
