import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { GitCompareArrows, Pin } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { ApiFailure } from "@/api/errors";
import { api } from "@/auth";
import { Chips, Label, QuietEmpty, Row, RowList, RowsSkeleton, Screen, StillTrying, T, TabRow, useProgressive } from "@/ds";
import { Enter, Swap } from "@/motion";
import { SoonState } from "@/practise/soon";
import type { MedicineList } from "@/practise/types";
import type { MedicinePage, ReferenceHome } from "@/practise/contract";
import { layout, space, useTheme } from "@/theme";
import { LinkCard, QuietError, SearchField } from "./kit";
import { ClassMark } from "./marks";
import { searchMeds } from "./meds";
import { pinnedMeds, recentMeds } from "./pins";

export const libraryKeys = { list: ["library", "medicines"] as const, med: (id: string) => ["library", "medicine", id] as const };
/** GET /library/medicines: every medicine, searched on the phone (the website's rule). */
export const useMedicineList = () => useQuery({ queryKey: libraryKeys.list, queryFn: () => api.get<MedicineList>("/library/medicines"), staleTime: 60 * 60_000 });
/** GET /library/reference: the website's grouping by what each medicine acts on (mechanismIndex), read only when "By how they work" is open. */
export const useByMechanism = (enabled: boolean) => useQuery({ queryKey: ["library", "reference"], queryFn: () => api.get<ReferenceHome>("/library/reference"), staleTime: 60 * 60_000, enabled });

export type MechanismGroup = { tag: string; items: { m: MedRow; q: string | null }[] };
/** The server's groups, matched to the app's medicine rows by slug or name. Medicines the app does not list are left out, and so are groups left empty. */
export function mechanismGroups(home: ReferenceHome | undefined, rows: readonly MedRow[]): MechanismGroup[] {
  if (!home) return [];
  const byKey = new Map<string, MedRow>();
  for (const r of rows) {
    byKey.set(r.id.toLowerCase(), r);
    byKey.set(r.name.trim().toLowerCase(), r);
  }
  return home.byMechanism
    .map((g) => {
      const seen = new Set<string>();
      const items: MechanismGroup["items"] = [];
      for (const d of g.drugs) {
        const m = byKey.get(d.slug.toLowerCase()) ?? byKey.get(d.name.trim().toLowerCase());
        if (m && !seen.has(m.id)) {
          seen.add(m.id);
          items.push({ m, q: d.qualifier });
        }
      }
      return { tag: g.tag, items };
    })
    .filter((g) => g.items.length);
}

export const useMedicinePage = (id: string) => useQuery({ queryKey: libraryKeys.med(id), queryFn: () => api.get<MedicinePage>(`/library/medicines/${encodeURIComponent(id)}`), staleTime: 60 * 60_000, enabled: !!id });

type MedRow = MedicineList["rows"][number];
type By = "class" | "how";

/**
 * Medicines, opened from the Notes tab (route /medicines). Search first, then
 * browse two ways: by class (the six families) or by how they work (what each
 * medicine acts on). Pinned and recently opened sit on top. Nothing is hidden
 * or cut, and nothing in a dose line moves.
 */
export function LibraryScreen() {
  const c = useTheme();
  const q = useMedicineList();
  const [text, setText] = React.useState("");
  const [by, setBy] = React.useState<By>("class");
  const [group, setGroup] = React.useState("All");
  const pinned = pinnedMeds.use();
  const recentIds = recentMeds.use();
  const all = React.useMemo(() => q.data?.rows ?? [], [q.data]);
  const found = React.useMemo(() => searchMeds(all, text), [all, text]);
  const soon = q.error instanceof ApiFailure && q.error.code === "not_found";
  const searching = !!text.trim();
  const row = (m: MedRow, prefix = "med", qualifier?: string) => (
    <Row
      key={`${prefix}-${m.id}`}
      testID={`${prefix}-${m.id}`}
      icon={<ClassMark group={m.group} spine />}
      title={m.name}
      meta={qualifier ? `${m.cls} · ${qualifier}` : `${m.cls}${m.dose ? ` · usual ${m.dose}` : ""}${m.brands.length ? ` · ${m.brands.slice(0, 2).join(", ")}` : ""}`}
      trailing={pinned.includes(m.id) ? <Pin size={16} color={c.muted} fill={c.muted} accessibilityLabel="Pinned" /> : undefined}
      chevron={false}
      onPress={() => router.push(`/medicine/${encodeURIComponent(m.id)}`)}
    />
  );
  const byId = (ids: string[]) => ids.map((id) => all.find((r) => r.id === id)).filter((r): r is MedRow => !!r);
  const pins = byId(pinned);
  const recent = byId(recentIds)
    .filter((r) => !pinned.includes(r.id))
    .slice(0, 3);
  const n = q.data?.rows.length;
  return (
    <Screen area="library" title="Medicines" lead={n ? `${n} medicines, for learning` : "Doses, cautions and how they work"} testID="library" gap={space[5]} onRefresh={() => void q.refetch()} refreshing={q.isRefetching}>
      <View style={{ gap: space[3] }}>
        <SearchField testID="library-search" value={text} onChange={setText} placeholder="Name, brand, group or condition" label="Search medicines by name, brand, group or use" />
        {q.data && !searching ? (
          <TabRow
            tabs={[
              { id: "class", name: "By class" },
              { id: "how", name: "By how they work" },
            ]}
            value={by}
            onChange={setBy}
          />
        ) : null}
      </View>
      {q.isError && q.data === undefined ? (
        soon ? (
          <SoonState web="/library" />
        ) : (
          <QuietError error={q.error} what="the medicine library" onRetry={() => void q.refetch()} />
        )
      ) : !q.data ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={9} />
          <StillTrying failed={q.failureCount > 0} />
        </View>
      ) : !all.length ? (
        <QuietEmpty title="The medicine library opens soon" body="Medicine pages show up here as they are added." testID="library-none" />
      ) : searching ? (
        found.length ? (
          <View style={{ gap: space[2] }}>
            <T v="label" tone="muted" num testID="library-count" style={{ paddingHorizontal: space[1] }}>
              {`${found.length} match`}
            </T>
            <MedRows rows={found} still row={row} />
          </View>
        ) : (
          <QuietEmpty title="No medicine by that name" body="Check the spelling, or try the brand name or the condition." action={{ label: "Clear the search", onPress: () => setText("") }} testID="library-empty" />
        )
      ) : (
        <>
          {pins.length ? (
            <Enter i={0} style={{ gap: space[2] }}>
              <Label>Pinned</Label>
              <RowList bare>{pins.map((m) => row(m, "pinned"))}</RowList>
            </Enter>
          ) : null}
          {recent.length ? (
            <Enter i={1} style={{ gap: space[2] }}>
              <Label>Recently opened</Label>
              <RowList bare>{recent.map((m) => row(m, "recent"))}</RowList>
            </Enter>
          ) : null}
          <Swap k={by} style={{ gap: space[5] }}>
            {by === "class" ? <ByClass groups={q.data.groups} rows={all} group={group} setGroup={setGroup} row={row} /> : <ByHow rows={all} row={row} />}
          </Swap>
          <LinkCard items={[{ testID: "library-compare", title: "Compare two medicines", meta: "Side by side, fact by fact", icon: <GitCompareArrows size={20} color={c.ink} />, onPress: () => router.push("/medicine/compare") }]} />
        </>
      )}
    </Screen>
  );
}

/** The six families: one row of chips, then each family under its name. */
function ByClass({ groups, rows, group, setGroup, row }: { groups: string[]; rows: MedRow[]; group: string; setGroup: (g: string) => void; row: (m: MedRow) => React.ReactNode }) {
  const names = group === "All" ? [...groups, ...Array.from(new Set(rows.map((r) => r.group))).filter((g) => !groups.includes(g))] : [group];
  return (
    <>
      <Chips scroll label="Class" options={[{ id: "All", name: "All" }, ...groups.map((g) => ({ id: g, name: g, mark: <ClassMark group={g} size={10} /> }))]} value={group} onChange={setGroup} />
      {names.map((g) => {
        const items = rows.filter((r) => r.group === g);
        if (!items.length) return null;
        return (
          <View key={g} style={{ gap: space[2] }} testID={`class-${g}`}>
            <Label>{`${g} · ${items.length}`}</Label>
            <MedRows rows={items} still={rows.length > 40} row={row} />
          </View>
        );
      })}
    </>
  );
}

/** What each medicine acts on. A medicine sits under every target it has, so the same name can show twice. */
function ByHow({ rows, row }: { rows: MedRow[]; row: (m: MedRow, prefix?: string, qualifier?: string) => React.ReactNode }) {
  const c = useTheme();
  const q = useByMechanism(true);
  const groups = React.useMemo(() => mechanismGroups(q.data, rows), [q.data, rows]);
  if (q.isLoading) return <RowsSkeleton />;
  if (q.isError && !q.data) return <QuietError what="the groups" error={q.error} onRetry={() => void q.refetch()} testID="how-error" />;
  if (!groups.length) return <QuietEmpty title="Not grouped yet" body="Browse by class for now. Each medicine page has How it works at the end." testID="how-empty" />;
  return (
    <>
      <T v="small" tone="muted" testID="how-note">
        Grouped by what each medicine acts on. A medicine with more than one target shows under each.
      </T>
      {groups.map((g, i) => (
        <View key={g.tag} style={{ gap: space[2] }} testID={`how-${i}`}>
          <View style={{ backgroundColor: c.card, borderRadius: layout.radius, paddingVertical: space[3], paddingHorizontal: space[4], gap: 2 }}>
            <T v="bodyStrong" accessibilityRole="header">
              {g.tag}
            </T>
          </View>
          <RowList bare still>
            {g.items.map((x) => row(x.m, `how-${i}`, x.q ?? undefined))}
          </RowList>
        </View>
      ))}
    </>
  );
}

/** The medicine rows, drawn a part at a time (the library is long). */
function MedRows({ rows, still, row }: { rows: MedRow[]; still: boolean; row: (m: MedRow) => React.ReactNode }) {
  const shown = useProgressive(rows.length);
  return (
    <RowList bare still={still}>
      {rows.slice(0, shown).map((m) => row(m))}
    </RowList>
  );
}
