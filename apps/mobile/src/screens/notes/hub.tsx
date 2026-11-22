import { router } from "expo-router";
import { ArrowRight, BookA, Bookmark, GitCompareArrows, NotebookText, Pill, Search } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { useNotes, useTerms } from "@/api/learn";
import { go } from "@/api/prefetch";
import { Label, Row, RowList, Screen, Stone, T } from "@/ds";
import { useMedicineList } from "@/library/list";
import { Enter, Press } from "@/motion";
import { TabTop } from "@/nav/top";
import { fonts, space, useTheme, type Area } from "@/theme";

/**
 * The Notes tab: one place for everything a student looks up fast. For now it
 * is a hub over the three screens that already exist (revision notes, the A to
 * Z quick reference, the medicine library); they become one searchable library
 * in a later step. Counts come from the same queries those screens use, so
 * opening one is instant.
 */
export function NotesHubScreen() {
  const c = useTheme();
  const notes = useNotes();
  const terms = useTerms();
  const meds = useMedicineList();
  const refresh = () => {
    void notes.refetch();
    void terms.refetch();
    void meds.refetch();
  };
  const count = (n: number | undefined, one: string, many: string) => (n === undefined ? "" : `${n} ${n === 1 ? one : many}`);
  return (
    <Screen
      tab
      area="library"
      top={<TabTop />}
      testID="notes-hub"
      title="Notes"
      lead="Everything you look up, in one place."
      gap={space[5]}
      onRefresh={refresh}
      refreshing={notes.isRefetching || terms.isRefetching || meds.isRefetching}
      field={
        <Press testID="notes-search" accessibilityRole="search" accessibilityLabel="Search disorders, medicines and terms" onPress={() => go("/reference")} scale={0.98} innerStyle={{ minHeight: 52, borderRadius: 26, backgroundColor: c.fieldTint, flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[4] }}>
          <Search size={18} color={c.onField} />
          <T v="small" tone="onFieldMuted" style={{ flex: 1 }}>
            Search disorders, medicines, terms
          </T>
        </Press>
      }
    >
      <Enter i={0}>
        <View style={{ flexDirection: "row", gap: space[3] }}>
          <Shelf testID="hub-notes" area="learn" icon={NotebookText} title="Revision notes" meta={count(notes.data?.notes.length, "note", "notes") || "One page per topic"} href="/notes" />
          <Shelf testID="hub-medicines" area="library" icon={Pill} title="Medicines" meta={count(meds.data?.rows.length, "medicine", "medicines") || "Doses and groups"} href="/medicines" />
        </View>
      </Enter>
      <Enter i={1}>
        <Shelf wide testID="hub-reference" area="me" icon={BookA} title="Quick reference" meta={[count(terms.data?.items.length, "entry", "entries"), "A to Z"].filter(Boolean).join(" · ")} href="/reference" />
      </Enter>
      <Enter i={2}>
        <View style={{ gap: space[2] }}>
          <Label>Also here</Label>
          <RowList bare>
            <Row testID="hub-saved" title="Saved" meta="Your bookmarks and notes" icon={<Bookmark size={20} color={c.ink} />} onPress={() => go("/saved")} chevron />
            <Row testID="hub-compare" title="Compare two medicines" icon={<GitCompareArrows size={20} color={c.ink} />} onPress={() => go("/medicine/compare")} chevron />
          </RowList>
        </View>
      </Enter>
    </Screen>
  );
}

/** One shelf of the library: a stone in its area's quiet wash, an icon pebble, the name in the title face and a count. */
function Shelf({ title, meta, icon: Icon, href, area, wide, testID }: { title: string; meta: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; href: string; area: Area; wide?: boolean; testID: string }) {
  const c = useTheme();
  const a = c.areas[area];
  return (
    <Stone testID={testID} accessibilityLabel={`${title}. ${meta}`} grow={() => router.push(href)} pad={space[4]} style={{ flex: 1 }}>
      <View style={{ minHeight: wide ? 0 : 132, flexDirection: wide ? "row" : "column", alignItems: wide ? "center" : "flex-start", justifyContent: "space-between", gap: space[3] }}>
        <View style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: a.wash, borderTopLeftRadius: 22, borderTopRightRadius: 26, borderBottomRightRadius: 23, borderBottomLeftRadius: 25 }}>
          <Icon size={22} color={a.deep} strokeWidth={1.9} />
        </View>
        <View style={{ flex: wide ? 1 : undefined, minWidth: 0, gap: 2 }}>
          <T style={{ fontFamily: fonts.h1, fontSize: 19, lineHeight: 23, letterSpacing: -0.2 }}>{title}</T>
          {meta ? (
            <T v="small" tone="muted" num>
              {meta}
            </T>
          ) : null}
        </View>
        {wide ? <ArrowRight size={18} color={c.muted} /> : null}
      </View>
    </Stone>
  );
}

