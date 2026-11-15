import { router } from "expo-router";
import { BookOpen, ChevronLeft, CirclePlay, MessageCircleQuestionMark, Pill, Search as SearchIcon, Settings } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCourse, useCourses, useDoubts, useLibraryMedicines, useMe, useStudyHome } from "@/api/queries";
import { EmptyState, Row, RowList, Section, T } from "@/ds";
import { layout, space, type as scale, useTheme } from "@/theme";

type Hit = { key: string; title: string; meta?: string; kind: "lecture" | "module" | "medicine" | "doubt" | "screen"; href: string };

const SCREENS: Hit[] = [
  { key: "s-progress", title: "Progress", kind: "screen", href: "/progress" },
  { key: "s-certs", title: "Certificates and badges", kind: "screen", href: "/certificates" },
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
  const [q, setQ] = React.useState("");
  const me = useMe();
  const can = me.data?.access.can;
  const courses = useCourses();
  const courseId = courses.data?.courses[0]?.id ?? "";
  const course = useCourse(courseId);
  const study = useStudyHome();
  const term = q.trim();
  const meds = useLibraryMedicines(term.length >= 2 && can?.medicines !== false);
  const doubts = useDoubts(false);

  const hits: Hit[] = React.useMemo(() => {
    if (term.length < 2) return [];
    const out: Hit[] = [];
    for (const w of course.data?.weeks ?? []) for (const l of w.lessons) if (l.openable && matches(l.title, term)) out.push({ key: `l-${l.id}`, title: l.title, meta: `Lecture ${l.number} · Week ${w.num}`, kind: "lecture", href: `/lecture/${l.id}` });
    if (can?.study !== false) for (const m of study.data?.modules ?? []) if (matches(`${m.title} ${m.tagline}`, term)) out.push({ key: `m-${m.id}`, title: m.title, meta: `Module ${m.num}`, kind: "module", href: `/study/${m.id}` });
    if (can?.medicines !== false) for (const r of (meds.data?.rows ?? []).filter((x) => matches(`${x.name} ${x.brands.join(" ")} ${x.cls}`, term)).slice(0, 6)) out.push({ key: `d-${r.id}`, title: r.name, meta: r.cls, kind: "medicine", href: `/medicine/${r.id}` });
    for (const d of doubts.data?.items ?? []) if (matches(`${d.title} ${d.topic ?? ""}`, term)) out.push({ key: `q-${d.id}`, title: d.title, meta: "Doubt", kind: "doubt", href: `/doubt/${d.id}` });
    for (const s of SCREENS) if (matches(s.title, term)) out.push(s);
    return out;
  }, [term, course.data, study.data, meds.data, doubts.data, can]);

  const ICON = { lecture: CirclePlay, module: BookOpen, medicine: Pill, doubt: MessageCircleQuestionMark, screen: Settings } as const;
  const groups: { title: string; kinds: Hit["kind"][] }[] = [
    { title: "Lectures", kinds: ["lecture"] },
    { title: "Study", kinds: ["module"] },
    { title: "Medicines", kinds: ["medicine"] },
    { title: "Doubts", kinds: ["doubt"] },
    { title: "In the app", kinds: ["screen"] },
  ];

  return (
    <View testID="search" style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[1], paddingRight: layout.gutter, paddingLeft: space[1], minHeight: 64, borderBottomWidth: 1, borderColor: c.hairline }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
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
          <EmptyState mood="puzzled" title="Nothing found" body={`Nothing matches "${term}". Try a shorter word.`} testID="search-empty" />
        )}
      </ScrollView>
    </View>
  );
}
