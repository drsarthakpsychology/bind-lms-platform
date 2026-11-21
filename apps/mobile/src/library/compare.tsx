import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeftRight, Plus } from "lucide-react-native";
import * as React from "react";
import { useWindowDimensions, View } from "react-native";

import { Label, LoadError, QuietEmpty, Row, RowList, RowsSkeleton, Screen, Sheet, StillTrying, T } from "@/ds";
import { Enter, Press } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import { SearchField } from "./kit";
import { useMedicineList, useMedicinePage } from "./list";
import { ClassMark } from "./marks";
import { searchMeds, type HalfLife, type Mechanism, type Med } from "./meds";

type Side = { med: Med; mech: Mechanism | null; half: HalfLife | null };

/** The facts that matter when choosing between two medicines, in the page's order. */
function rowsOf(s: Side): [string, string[]][] {
  const m = s.med;
  const usual = m.doses[m.defaultDose] ?? m.doses[0];
  return [
    ["Used for", m.uses],
    ["Usual dose", usual ? [`${usual.amount}: ${usual.label}`] : []],
    ["Common side effects", m.common],
    ["What to check", m.checks],
    ["Interactions", m.interactions ?? []],
    ["Serious: act the same day", m.serious],
    ["Half-life", s.half ? [s.half.hl] : []],
    ["How it works", s.mech ? [s.mech.plain] : []],
  ];
}

/** Choose one medicine: a search and the list, in a sheet. */
function MedPicker({ open, onClose, onPick, title, not }: { open: boolean; onClose: () => void; onPick: (id: string) => void; title: string; /** The medicine already on the other side. */ not?: string }) {
  const list = useMedicineList();
  const [text, setText] = React.useState("");
  const rows = searchMeds(list.data?.rows ?? [], text)
    .filter((r) => r.id !== not)
    .slice(0, text.trim() ? 12 : 8);
  return (
    <Sheet open={open} onClose={onClose} title={title} testID="compare-picker">
      <View style={{ gap: space[3] }}>
        <SearchField testID="compare-search" value={text} onChange={setText} placeholder="Name or brand" label="Search medicines" />
        {list.isError && list.data === undefined ? (
          <LoadError error={list.error} what="the medicine library" onRetry={() => void list.refetch()} />
        ) : !list.data ? (
          <RowsSkeleton rows={4} />
        ) : rows.length ? (
          <RowList bare still>
            {rows.map((r) => (
              <Row
                key={r.id}
                testID={`pick-${r.id}`}
                icon={<ClassMark group={r.group} spine />}
                title={r.name}
                meta={r.cls}
                chevron={false}
                onPress={() => {
                  setText("");
                  onPick(r.id);
                }}
              />
            ))}
          </RowList>
        ) : (
          <T tone="muted">No medicine by that name.</T>
        )}
      </View>
    </Sheet>
  );
}

/** One side of the pair at the top: the medicine, or an empty place to choose one. */
function Slot({ side, which, onChange }: { side: Side | null; which: "a" | "b"; onChange: () => void }) {
  const c = useTheme();
  const word = which === "a" ? "First medicine" : "Second medicine";
  return (
    <Press testID={`compare-slot-${which}`} accessibilityRole="button" accessibilityLabel={side ? `${side.med.name}. Change the ${word.toLowerCase()}` : `Choose the ${word.toLowerCase()}`} onPress={onChange} style={{ flex: 1 }} scale={0.97} innerStyle={{ minHeight: 96, padding: space[4], gap: space[1], justifyContent: "space-between", borderRadius: layout.radiusLg, backgroundColor: side ? c.card : "transparent", borderWidth: side ? 0 : 1.5, borderColor: c.card }}>
      {side ? (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <ClassMark group={side.med.group} />
            <T v="caption" tone="muted" style={{ flex: 1 }} numberOfLines={2}>
              {side.med.cls}
            </T>
          </View>
          <T v="h3">{side.med.name}</T>
          <T v="caption" tone="link">
            Change
          </T>
        </>
      ) : (
        <>
          <Plus size={20} color={c.muted} />
          <T v="bodyStrong">{word}</T>
          <T v="caption" tone="muted">
            Tap to choose
          </T>
        </>
      )}
    </Press>
  );
}

/**
 * Two medicines side by side, fact by fact. Opens empty from the Notes tab
 * (choose both) or filled from a medicine page. On phones over 360px wide
 * each fact is two columns (A | B) on one stone so the two read across; on
 * narrower phones the two sit one under the other. Nothing here moves: these
 * are doses and cautions.
 */
export function CompareScreen() {
  const c = useTheme();
  const p = useLocalSearchParams<{ a?: string; b?: string }>();
  const a = typeof p.a === "string" ? p.a : "";
  const b = typeof p.b === "string" ? p.b : "";
  const { width } = useWindowDimensions();
  const qa = useMedicinePage(a);
  const qb = useMedicinePage(b);
  const [picking, setPicking] = React.useState<"a" | "b" | null>(null);
  const failed = (a && qa.isError && qa.data === undefined) || (b && qb.isError && qb.data === undefined);
  const side = (d: typeof qa.data): Side | null => (d ? { med: d.med as unknown as Med, mech: d.mechanism as Mechanism | null, half: d.halfLife as HalfLife | null } : null);
  const sa = side(qa.data);
  const sb = side(qb.data);
  const both = sa && sb ? [sa, sb] : null;
  const rows = both ? both.map(rowsOf) : null;
  const two = width > 360;
  const set = (next: { a?: string; b?: string }) => router.setParams({ a: next.a ?? a, b: next.b ?? b });
  return (
    <Screen area="library" testID="compare" title="Compare" lead={both ? `${both[0]!.med.name} and ${both[1]!.med.name}` : "Two medicines, side by side"} gap={space[5]}>
      <Stack.Screen options={{ title: "" }} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
        <Slot side={sa} which="a" onChange={() => setPicking("a")} />
        <Press testID="compare-swap" accessibilityRole="button" accessibilityLabel="Swap the two sides" disabled={!a || !b} onPress={() => set({ a: b, b: a })} squish scale={0.9} hitSlop={4} innerStyle={{ width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: c.card, opacity: a && b ? 1 : 0.5 }}>
          <ArrowLeftRight size={18} color={c.ink} />
        </Press>
        <Slot side={sb} which="b" onChange={() => setPicking("b")} />
      </View>
      {failed ? (
        <LoadError
          error={qa.error ?? qb.error}
          what="these medicines"
          onRetry={() => {
            void qa.refetch();
            void qb.refetch();
          }}
        />
      ) : !a || !b ? (
        <QuietEmpty testID="compare-empty" title={a || b ? "Now choose the other one" : "Choose two medicines"} body="You will see uses, usual dose, side effects, checks, interactions and how each works, next to each other." action={{ label: a ? "Choose the second" : "Choose the first", onPress: () => setPicking(a ? "b" : "a") }} />
      ) : !both || !rows ? (
        <View style={{ gap: space[3] }}>
          <RowsSkeleton rows={8} />
          <StillTrying failed={qa.failureCount > 0 || qb.failureCount > 0} />
        </View>
      ) : (
        <>
          {rows[0]!.map(([label], i) => (
            <Enter key={label} i={Math.min(i, 6)} style={{ gap: space[2] }} testID={`compare-${i}`}>
              <Label>{label}</Label>
              <View style={[{ backgroundColor: label.startsWith("Serious") ? c.alertBg : c.card, borderRadius: layout.radiusLg, padding: space[4] }, two ? { flexDirection: "row", gap: space[4] } : { gap: space[4] }]}>
                {both.map((s, k) => {
                  const items = rows[k]![i]![1];
                  return (
                    <View key={s.med.id} style={[{ gap: space[1], minWidth: 0 }, two ? { flex: 1, paddingLeft: k ? space[4] : 0, borderLeftWidth: k ? 1 : 0, borderColor: c.hairline } : null]}>
                      <T v="caption" tone="muted">
                        {s.med.name}
                      </T>
                      {items.length ? (
                        items.map((t, j) => (
                          <T key={j} v={two ? "small" : "body"} num>
                            {t}
                          </T>
                        ))
                      ) : (
                        <T v={two ? "small" : "body"} tone="muted">
                          Not listed
                        </T>
                      )}
                    </View>
                  );
                })}
              </View>
            </Enter>
          ))}
          <T v="caption" tone="muted">
            Typical adult doses, for learning. The prescriber chooses for each patient.
          </T>
          <View style={{ gap: space[2] }}>
            <Label>Open the full page</Label>
            <RowList bare>
              {both.map((s) => (
                <Row key={s.med.id} testID={`compare-open-${s.med.id}`} icon={<ClassMark group={s.med.group} spine />} title={s.med.name} meta={s.med.cls} onPress={() => router.push(`/medicine/${encodeURIComponent(s.med.id)}`)} />
              ))}
            </RowList>
          </View>
        </>
      )}
      <MedPicker
        open={picking !== null}
        onClose={() => setPicking(null)}
        title={picking === "b" ? "Second medicine" : "First medicine"}
        not={picking === "a" ? b : a}
        onPick={(id) => {
          const which = picking;
          setPicking(null);
          if (which) set({ [which]: id });
        }}
      />
    </Screen>
  );
}
