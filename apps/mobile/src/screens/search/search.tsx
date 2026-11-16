import { useQueries } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { BookOpen, ChevronLeft, CirclePlay, Layers, MessageCircleQuestionMark, NotebookText, Pill, Search as SearchIcon, Settings } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotes, useTerms } from "@/api/learn";
import { searchRefs } from "@/screens/reference/reference";
import { courseQuery, useCourses, useDoubts, useLibraryMedicines, useMe, useStudyHome } from "@/api/queries";
import { EmptyState, Row, RowList, Section, T } from "@/ds";
import { layout, space, type as scale, useTheme } from "@/theme";

type Hit = { key: string; title: string; meta?: string; kind: "lecture" | "module" | "note" | "reference" | "medicine" | "doubt" | "screen"; href: string };

const SCREENS: Hit[] = [
  { key: "s-progress", title: "Progress", kind: "screen", href: "/progress" },
  { key: "s-certs", title: "Certificates and badges", kind: "screen", href: "/certificates" },
  { key: "s-journey", title: "My journey", kind: "screen", href: "/journey" },
  { key: "s-saved", title: "Saved bookmarks and notes", kind: "screen", href: "/saved" },
  { key: "s-assignments", title: "Assignments", kind: "screen", href: "/assignments" },
  { key: "s-settings", title: "Settings", kind: "screen", href: "/settings" },
  { key: "s-notifications", title: "Notifications", kind: "screen", href: "/notifications" },
  { key: "s-help", title: "Help", kind: "screen", href: "/help" },
];

export function matches(text: string, q: string): boolean {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const t = text.toLowerCase();
  return words.every((w) => t.includes(w));
}

/** Search across lectures, modules, medicines, doubts and the app's own screens. */
export function SearchScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  // A link can bring the words with it (vibha://search?q=depression).
  const params = useLocalSearchParams<{ q?: string | string[] }>();
  const [q, setQ] = React.useState(() => (Array.isArray(params.q) ? (params.q[0] ?? "") : (params.q ?? "")).slice(0, 80));
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
  const meds = useLibraryMedicines(term.length >= 2 && can?.medicines !== false);
  const doubts = useDoubts(false);
  const notes = useNotes(studyOpen);
  const refs = useTerms(term.length >= 2 && studyOpen);

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
    if (can?.medicines !== false) for (const r of (meds.data?.rows ?? []).filter((x) => matches(`${x.name} ${x.brands.join(" ")} ${x.cls}`, term)).slice(0, 6)) out.push({ key: `d-${r.id}`, title: r.name, meta: r.cls, kind: "medicine", href: `/medicine/${e(r.id)}` });
    for (const d of doubts.data?.items ?? []) if (matches(`${d.title} ${d.topic ?? ""}`, term)) out.push({ key: `q-${d.id}`, title: d.title, meta: "Doubt", kind: "doubt", href: `/doubt/${e(d.id)}` });
    for (const s of SCREENS) if (matches(s.title, term) && (studyOpen || s.key !== "s-saved")) out.push(s);
    return out;
    // weeksKey stands for every course's answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, weeksKey, study.data, meds.data, doubts.data, can, studyOpen, notes.data, refs.data]);

  const ICON = { lecture: CirclePlay, module: BookOpen, note: NotebookText, reference: Layers, medicine: Pill, doubt: MessageCircleQuestionMark, screen: Settings } as const;
  const groups: { title: string; kinds: Hit["kind"][] }[] = [
    { title: "Lectures", kinds: ["lecture"] },
    { title: "Study", kinds: ["module", "note"] },
    { title: "Quick reference", kinds: ["reference"] },
    { title: "Medicines", kinds: ["medicine"] },
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
            placeholder="Lectures, modules, medicines"
            placeholderTextColor={c.muted}
            accessibilityLabel="Search"
            returnKeyType="search"
            autoCorrect={false}
            maxFontSizeMultiplier={1.4}
            style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]}
          />
        </View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: layout.gutter, gap: layout.section, paddingBottom: insets.bottom + space[6] }}>
        {term.length < 2 ? (
          <T tone="muted">Type two letters or more.</T>
        ) : hits.length ? (
          groups.map((g) => {
            const rows = hits.filter((h) => g.kinds.includes(h.kind));
            if (!rows.length) return null;
            return (
              <Section key={g.title} title={g.title} quiet>
                <RowList still>
                  {rows.map((h) => {
                    const Icon = ICON[h.kind];
                    return <Row key={h.key} title={h.title} meta={h.meta} icon={<Icon size={20} color={c.muted} />} onPress={() => router.push(h.href)} />;
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
