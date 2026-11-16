import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftRight, BookOpen, ListTree } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, View, type ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiFailure } from "@/api/errors";
import { Button, EmptyState, LoadError, Row, RowList, RowsSkeleton, Sheet, T } from "@/ds";
import { haptic } from "@/lib/haptics";
import { openTarget } from "@/nav/targets";
import { fonts, layout, space, useTheme } from "@/theme";
import { MedicineDiagrams } from "./med-diagrams";
import { useMedicineList, useMedicinePage } from "./list";
import { recentMedicines } from "@/lib/recent";
import { ClassMark } from "./marks";
import { searchMeds } from "./meds";
import type { MedicinePage, MedSection } from "@/practise/contract";
import { useReducedMotion } from "react-native-reanimated";
import { Enter, Swap } from "@/motion";

type View_ = "student" | "clinician";

function Bullets({ items, tone }: { items: string[]; tone?: "alert" }) {
  return (
    <View style={{ gap: space[2] }}>
      {items.map((t, k) => (
        <View key={k} style={{ flexDirection: "row", gap: space[3] }}>
          <T v="reading" tone={tone ?? "muted"}>
            •
          </T>
          <T v="reading" tone={tone ?? "ink"} style={{ flex: 1 }}>
            {t}
          </T>
        </View>
      ))}
    </View>
  );
}

function Fact({ name, children }: { name: string; children: React.ReactNode }) {
  const c = useTheme();
  return (
    <View style={{ gap: 2, borderTopWidth: 1, borderColor: c.hairline, paddingTop: space[3] }}>
      <T v="caption" tone="muted">
        {name.toUpperCase()}
      </T>
      {typeof children === "string" ? <T>{children}</T> : children}
    </View>
  );
}

/**
 * A medicine page, from the server's own plan (GET /library/medicines/:id
 * `sections`): only the sections the website shows for this medicine, in its
 * order and with its names (Used for, Doses, Side effects, What to check,
 * Interactions, Serious: act the same day, Special groups, Switching and
 * stopping, How it works last with its pictures). A section index sheet jumps
 * to any part.
 */
export function MedicineScreen() {
  const { id = "", section } = useLocalSearchParams<{ id: string; section?: string }>();
  const q = useMedicinePage(String(id));
  const openedId = q.data?.id;
  React.useEffect(() => {
    if (openedId) recentMedicines.add(openedId);
  }, [openedId]);
  if (q.isError) {
    const soon = q.error instanceof ApiFailure && q.error.code === "not_found";
    return <View style={{ flex: 1, padding: layout.gutter }}>{soon ? <EmptyState mood="sleepy" title="Not in the library yet" body="This medicine page arrives in the app soon." /> : <LoadError error={q.error} what="this medicine" onRetry={() => void q.refetch()} />}</View>;
  }
  if (!q.data) {
    return (
      <View style={{ flex: 1, padding: layout.gutter }}>
        <RowsSkeleton rows={8} />
      </View>
    );
  }
  return <MedicinePageView key={q.data.id} page={q.data} jump={section} />;
}

type Sec = MedSection;

export function MedicinePageView({ page, jump }: { page: MedicinePage; jump?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [view, setView] = React.useState<View_>("student");
  const doses = page.sections.find((x): x is Extract<Sec, { id: "doses" }> => x.id === "doses");
  const [dose, setDose] = React.useState(doses?.defaultDose ?? 0);
  const [index, setIndex] = React.useState(false);
  const [comparing, setComparing] = React.useState(false);
  const scroll = React.useRef<ScrollViewInstance>(null);
  const ys = React.useRef<Partial<Record<string, number>>>({});
  const jumped = React.useRef(false);
  const d = doses?.doses[dose] ?? doses?.doses[0];

  const go = (s: string) => {
    const y = ys.current[s];
    if (y !== undefined) scroll.current?.scrollTo({ y: Math.max(0, y - space[3]), animated: !reduce });
  };
  const at = (s: string) => (e: { nativeEvent: { layout: { y: number } } }) => {
    ys.current[s] = e.nativeEvent.layout.y;
    if (!jumped.current && jump === s) {
      jumped.current = true;
      setTimeout(() => go(s), 250);
    }
  };

  const body = (x: Sec) => {
    switch (x.id) {
      case "uses":
        return (
          <>
            <Bullets items={x.uses.length ? x.uses : x.points} />
            {x.standout.length ? (
              <Fact name="What sets it apart">
                <Bullets items={x.standout} />
              </Fact>
            ) : null}
          </>
        );
      case "doses":
        return (
          <>
            {/* The chips share the width and their words wrap, so a long label is never cut at the edge. */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }} accessibilityRole="tablist" accessibilityLabel="Doses">
              {x.doses.map((o, k) => (
                <Pressable
                  key={`${o.amount}-${k}`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: k === dose }}
                  accessibilityLabel={`${o.label}: ${o.amount}`}
                  onPress={() => {
                    haptic.select();
                    setDose(k);
                  }}
                  testID={`med-dose-${k}`}
                  style={({ pressed }) => ({ flexGrow: 1, flexBasis: "30%", minWidth: 96, minHeight: 56, paddingHorizontal: space[3], paddingVertical: space[2], justifyContent: "center", borderRadius: layout.radius, borderWidth: 1.5, borderColor: k === dose ? c.ink : c.cardLine, backgroundColor: k === dose ? c.primary : "transparent", transform: [{ scale: pressed ? 0.96 : 1 }] })}
                >
                  <T v="caption" style={{ color: k === dose ? c.onPrimary : c.muted }}>
                    {o.label}
                  </T>
                  <T v="bodyStrong" style={{ color: k === dose ? c.onPrimary : c.ink }}>
                    {o.amount}
                  </T>
                </Pressable>
              ))}
            </View>
            {d ? (
              <Swap k={`dose-${dose}-${view}`} style={{ gap: space[2] }}>
                <T v="small" tone="muted">
                  {d.use}
                </T>
                <T v="reading">{view === "student" ? d.student : d.clinician}</T>
                {d.watch?.length ? (
                  <Fact name="Watch for at this dose">
                    <Bullets items={d.watch} />
                  </Fact>
                ) : null}
              </Swap>
            ) : null}
            {x.take.length ? (
              <Fact name="How to take it">
                <Bullets items={x.take} />
              </Fact>
            ) : null}
            {x.forms ? <Fact name="Forms">{x.forms}</Fact> : null}
            {x.brands.length ? <Fact name="Indian brands">{x.brands.join(", ")}</Fact> : null}
            {x.note ? (
              <T v="small" tone="muted">
                {x.note}
              </T>
            ) : null}
          </>
        );
      case "groups":
        return x.facts.map((g) => (
          <Fact key={g.label} name={g.label}>
            {g.text}
          </Fact>
        ));
      case "how-it-works":
        return (
          <>
            {x.plain ? <T v="reading">{x.plain}</T> : null}
            {x.targets.length ? (
              <View style={{ borderTopWidth: 1.5, borderColor: c.ink }}>
                {x.targets.map((t) => (
                  <View key={t.target} style={{ gap: 2, paddingVertical: space[3], borderBottomWidth: 1, borderColor: c.hairline }}>
                    <T v="bodyStrong">{t.target}</T>
                    {view === "clinician" ? <T v="small">{t.action}</T> : null}
                    <T v="small" tone="muted">
                      {t.effect}
                    </T>
                  </View>
                ))}
              </View>
            ) : null}
            <MedicineDiagrams diagrams={x.diagrams} />
          </>
        );
      default:
        return <Bullets items={x.points} tone={x.id === "warnings" ? "alert" : undefined} />;
    }
  };

  const how = page.sections.find((x) => x.id === "how-it-works");
  const rest = page.sections.filter((x) => x.id !== "how-it-works");
  const part = (x: Sec) =>
    x.id === "warnings" ? (
      // The one band of colour on the page.
      <View key={x.id} onLayout={at(x.id)} testID="med-section-warnings" style={{ gap: space[3], backgroundColor: c.alertBg, borderRadius: layout.radius, padding: space[4] }}>
        <T v="h2" tone="alert">
          {x.title}
        </T>
        {body(x)}
      </View>
    ) : (
      <View key={x.id} onLayout={at(x.id)} style={{ gap: space[3] }} testID={`med-section-${x.id}`}>
        <T v="h2">{x.title}</T>
        {body(x)}
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }} testID="medicine">
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[4], paddingBottom: insets.bottom + space[7], gap: space[7], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
        <Enter style={{ gap: space[3] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <ClassMark group={page.group} />
            <T v="small" tone="muted" style={{ flex: 1 }}>
              {page.group} · {page.cls}
            </T>
          </View>
          <T v="display">{page.name}</T>
          {page.brands.length ? (
            <T v="small" tone="muted">
              Brands in India: {page.brands.join(", ")}
            </T>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], flexWrap: "wrap" }}>
            <View accessibilityRole="radiogroup" accessibilityLabel="How much detail" style={{ flexDirection: "row", backgroundColor: c.tint, borderRadius: 24, padding: 4 }}>
              {(["student", "clinician"] as const).map((v) => (
                <Pressable
                  key={v}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: view === v }}
                  onPress={() => {
                    haptic.select();
                    setView(v);
                  }}
                  testID={`med-view-${v}`}
                  style={{ minHeight: 40, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 20, backgroundColor: view === v ? c.card : "transparent", borderWidth: view === v ? 1.5 : 0, borderColor: c.cardLine }}
                >
                  <T v="small" style={{ fontFamily: fonts.semibold }}>
                    {v === "student" ? "Plain words" : "For clinicians"}
                  </T>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Pressable accessibilityRole="button" accessibilityLabel="Sections" onPress={() => setIndex(true)} testID="med-index" style={{ minWidth: layout.target, height: layout.target, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: space[1], paddingHorizontal: space[2] }}>
                <ListTree size={20} color={c.ink} />
                <T v="small" style={{ fontFamily: fonts.semibold }}>
                  Sections
                </T>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Compare with another medicine" onPress={() => setComparing(true)} testID="med-compare" style={{ width: layout.target, height: layout.target, alignItems: "center", justifyContent: "center" }}>
                <ArrowLeftRight size={20} color={c.ink} />
              </Pressable>
            </View>
          </View>
          <Swap k={view}>
            <T v="reading">{view === "student" ? page.summary.student : page.summary.clinician}</T>
          </Swap>
        </Enter>

        {rest.map(part)}

        {page.related.length || page.study ? (
          <View style={{ gap: space[3] }}>
            {page.related.length ? (
              <>
                <T v="h3">Related</T>
                <RowList>
                  {page.related.map((r) => (
                    <Row key={r.id} title={r.name} meta={r.cls} onPress={() => router.push(`/medicine/${encodeURIComponent(r.id)}`)} testID={`med-related-${r.id}`} />
                  ))}
                </RowList>
              </>
            ) : null}
            {page.study ? (
              <RowList>
                <Row title={`Learn it in Study: ${page.study.title}`} icon={<BookOpen size={20} color={c.muted} />} onPress={() => openTarget(page.study!.target)} />
              </RowList>
            ) : null}
          </View>
        ) : null}

        {how ? part(how) : null}
      </ScrollView>

      <Sheet open={index} onClose={() => setIndex(false)} title="Sections" testID="med-index-sheet">
        <RowList>
          {page.sections.map((x) => (
            <Row
              key={x.id}
              title={x.title}
              testID={`med-jump-${x.id}`}
              onPress={() => {
                setIndex(false);
                setTimeout(() => go(x.id), 220);
              }}
            />
          ))}
        </RowList>
      </Sheet>
      <ComparePicker open={comparing} onClose={() => setComparing(false)} from={{ id: page.id, name: page.name, cls: page.cls, related: page.related.map((r) => r.id) }} />
    </View>
  );
}

/** Pick the second medicine for Compare: related ones first, then a search. */
function ComparePicker({ open, onClose, from }: { open: boolean; onClose: () => void; from: { id: string; name: string; cls: string; related: string[] } }) {
  const list = useMedicineList();
  const rows = list.data?.rows ?? [];
  const firsts = rows.filter((r) => from.related.includes(r.id));
  const others = searchMeds(rows, from.cls).filter((r) => r.id !== from.id && !from.related.includes(r.id));
  const pick = (id: string) => {
    onClose();
    router.push(`/medicine/compare?a=${encodeURIComponent(from.id)}&b=${encodeURIComponent(id)}`);
  };
  return (
    <Sheet open={open} onClose={onClose} title={`Compare ${from.name} with`} testID="compare-picker">
      <RowList>
        {[...firsts, ...others.slice(0, 6), ...rows.filter((r) => r.id !== from.id && !firsts.includes(r) && !others.includes(r)).slice(0, 4)].map((r) => (
          <Row key={r.id} title={r.name} meta={r.cls} icon={<ClassMark group={r.group} spine />} onPress={() => pick(r.id)} testID={`compare-with-${r.id}`} />
        ))}
      </RowList>
      {!rows.length ? <Button kind="quiet" label="Close" onPress={onClose} /> : null}
    </Sheet>
  );
}
