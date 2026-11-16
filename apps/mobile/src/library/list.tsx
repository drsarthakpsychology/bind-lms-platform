import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Search, X } from "lucide-react-native";
import * as React from "react";
import { Pressable, TextInput, View } from "react-native";

import { ApiFailure } from "@/api/errors";
import { api } from "@/auth";
import { Chips, EmptyState, LoadError, Row, RowList, RowsSkeleton, Screen, Section, StillTrying, T, useProgressive } from "@/ds";
import { recentMedicines } from "@/lib/recent";
import { SoonState } from "@/practise/soon";
import { TabTop } from "@/nav/top";
import type { MedicineList } from "@/practise/types";
import type { MedicinePage } from "@/practise/contract";
import { layout, space, type as scale, useTheme } from "@/theme";
import { ClassMark } from "./marks";
import { searchMeds } from "./meds";

export const libraryKeys = { list: ["library", "medicines"] as const, med: (id: string) => ["library", "medicine", id] as const };
/** GET /library/medicines: every medicine, searched on the phone (the website's rule). */
export const useMedicineList = () => useQuery({ queryKey: libraryKeys.list, queryFn: () => api.get<MedicineList>("/library/medicines"), staleTime: 60 * 60_000 });
export const useMedicinePage = (id: string) => useQuery({ queryKey: libraryKeys.med(id), queryFn: () => api.get<MedicinePage>(`/library/medicines/${encodeURIComponent(id)}`), staleTime: 60 * 60_000, enabled: !!id });

/** Search, one row of group chips, then every medicine. Nothing is hidden or cut. */
export function LibraryScreen() {
  const c = useTheme();
  const q = useMedicineList();
  const [text, setText] = React.useState("");
  const [group, setGroup] = React.useState("All");
  const rows = React.useMemo(() => {
    const all = q.data?.rows ?? [];
    const found = searchMeds(all, text);
    return group === "All" ? found : found.filter((r) => r.group === group);
  }, [q.data, text, group]);
  const soon = q.error instanceof ApiFailure && q.error.code === "not_found";
  const filtering = !!text.trim() || group !== "All";
  const recentIds = recentMedicines.use();
  const recent = filtering || !q.data ? [] : recentIds.map((id) => q.data!.rows.find((r) => r.id === id)).filter((r): r is NonNullable<typeof r> => !!r).slice(0, 3);
  const row = (m: (typeof rows)[number], prefix = "med") => <Row key={m.id} testID={`${prefix}-${m.id}`} icon={<ClassMark group={m.group} spine />} title={m.name} meta={`${m.cls}${m.dose ? ` · usual ${m.dose}` : ""}${m.brands.length ? ` · ${m.brands.slice(0, 2).join(", ")}` : ""}`} onPress={() => router.push(`/medicine/${encodeURIComponent(m.id)}`)} />;
  return (
    <Screen tab area="library" top={<TabTop />} title="Medicines" testID="library" gap={space[4]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: layout.primary, borderRadius: layout.radius, borderWidth: 1.5, borderColor: c.cardLine, backgroundColor: c.card, paddingLeft: space[4] }}>
        <Search size={18} color={c.muted} />
        <TextInput testID="library-search" value={text} onChangeText={setText} placeholder="Name, brand, group or condition" placeholderTextColor={c.muted} accessibilityLabel="Search medicines by name, brand, group or use" autoCorrect={false} autoCapitalize="none" returnKeyType="search" maxFontSizeMultiplier={1.4} style={[scale.body, { flex: 1, color: c.ink, minHeight: layout.target }, { outlineStyle: "none" } as object]} />
        {text ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Clear the search" onPress={() => setText("")} style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
            <X size={18} color={c.muted} />
          </Pressable>
        ) : null}
      </View>
      {q.data ? <Chips scroll label="Group" options={[{ id: "All", name: "All" }, ...q.data.groups.map((g) => ({ id: g, name: g, mark: <ClassMark group={g} size={10} /> }))]} value={group} onChange={setGroup} /> : null}
      {q.isError ? (
        soon ? <SoonState web="/library" /> : <LoadError error={q.error} what="the medicine library" onRetry={() => void q.refetch()} />
      ) : !q.data ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={9} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : rows.length ? (
        <>
          {recent.length ? (
            <Section title="Recently opened" quiet>
              <RowList>{recent.map((m) => row(m, "recent"))}</RowList>
            </Section>
          ) : null}
          {/* A count only while searching or filtering: "3 match". */}
          {filtering ? (
            <T v="small" tone="muted" num testID="library-count">
              {`${rows.length} match`}
            </T>
          ) : recent.length ? (
            <T v="small" tone="muted">
              All medicines
            </T>
          ) : null}
          <MedRows key={group} rows={rows} still={!!text} row={row} />
        </>
      ) : (
        <EmptyState mood="missing" title="No medicine by that name" body="Check the spelling, or try the brand name or the condition." testID="library-empty" />
      )}
    </Screen>
  );
}

/** The medicine rows, drawn a part at a time (the library is long). */
function MedRows({ rows, still, row }: { rows: MedicineList["rows"]; still: boolean; row: (m: MedicineList["rows"][number]) => React.ReactNode }) {
  const shown = useProgressive(rows.length);
  return <RowList still={still}>{rows.slice(0, shown).map((m) => row(m))}</RowList>;
}
