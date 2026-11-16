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
import { Diagrams } from "./diagrams";
import { useMedicineList, useMedicinePage } from "./list";
import { ClassMark } from "./marks";
import { DOSE_NOTE, HOW_IT_WORKS, searchMeds, SECTION_NAMES, shownSections, splitTell, washoutLine, type HalfLife, type Mechanism, type Med, type MedVisual, type SectionId } from "./meds";

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

function Part({ id, shown, onAt, children }: { id: SectionId; shown: SectionId[]; onAt: (s: SectionId) => (e: { nativeEvent: { layout: { y: number } } }) => void; children: React.ReactNode }) {
  if (!shown.includes(id)) return null;
  return (
    <View onLayout={onAt(id)} style={{ gap: space[3] }} testID={`med-section-${id}`}>
      <T v="h2">{SECTION_NAMES[id]}</T>
      {children}
    </View>
  );
}

/**
 * A medicine page: every fact as the website has it, in the website's order
 * (what it is used for, doses, side effects, what to check, interactions,
 * the serious ones, special groups, stopping), How it works last with its
 * diagrams. A section index sheet jumps to any part.
 */
export function MedicineScreen() {
  const { id = "", section } = useLocalSearchParams<{ id: string; section?: string }>();
  const q = useMedicinePage(String(id));
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
  return <MedicinePageView key={q.data.med.id} med={q.data.med as unknown as Med} mech={q.data.mechanism as Mechanism | null} visuals={(q.data.visuals ?? []) as unknown as MedVisual[]} half={q.data.halfLife as HalfLife | null} related={q.data.related} study={q.data.study} jump={section} />;
}

export function MedicinePageView({ med, mech, visuals, half, related, study, jump }: { med: Med; mech: Mechanism | null; visuals: MedVisual[]; half: HalfLife | null; related: { id: string; name: string; cls: string }[]; study: { title: string; target: Parameters<typeof openTarget>[0] } | null; jump?: string }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const [view, setView] = React.useState<View_>("student");
  const [dose, setDose] = React.useState(med.defaultDose ?? 0);
  const [index, setIndex] = React.useState(false);
  const [comparing, setComparing] = React.useState(false);
  const scroll = React.useRef<ScrollViewInstance>(null);
  const ys = React.useRef<Partial<Record<SectionId, number>>>({});
  const jumped = React.useRef(false);
  const tell = splitTell(med);
  const sections = shownSections(med, { hasMechanism: !!mech, visuals: visuals.length, halfLife: !!half });
  const d = med.doses[dose] ?? med.doses[0];

  const go = (s: SectionId) => {
    const y = ys.current[s];
    if (y !== undefined) scroll.current?.scrollTo({ y: Math.max(0, y - space[3]), animated: true });
  };
  const at = (s: SectionId) => (e: { nativeEvent: { layout: { y: number } } }) => {
    ys.current[s] = e.nativeEvent.layout.y;
    if (!jumped.current && jump === s) {
      jumped.current = true;
      setTimeout(() => go(s), 250);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }} testID="medicine">
      <ScrollView ref={scroll} contentContainerStyle={{ paddingHorizontal: layout.gutter, paddingTop: space[4], paddingBottom: insets.bottom + space[7], gap: space[7], width: "100%", maxWidth: layout.readingWidth + layout.gutter * 2, alignSelf: "center" }}>
        <View style={{ gap: space[3] }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <ClassMark group={med.group} />
            <T v="small" tone="muted" style={{ flex: 1 }}>
              {med.group} · {med.cls}
            </T>
          </View>
          <T v="display">{med.name}</T>
          {med.brands.length ? (
            <T v="small" tone="muted">
              Brands in India: {med.brands.join(", ")}
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
          <T v="reading">{view === "student" ? med.student : med.clinician}</T>
        </View>

        <Part shown={sections} onAt={at} id="uses">
          <Bullets items={med.uses} />
          {med.standout.length ? (
            <Fact name="What sets it apart">
              <Bullets items={med.standout} />
            </Fact>
          ) : null}
        </Part>

        <Part shown={sections} onAt={at} id="doses">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -layout.gutter }} contentContainerStyle={{ paddingHorizontal: layout.gutter, gap: space[2] }} accessibilityRole="tablist" accessibilityLabel="Doses">
            {med.doses.map((x, k) => (
              <Pressable
                key={`${x.amount}-${k}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: k === dose }}
                accessibilityLabel={`${x.label}: ${x.amount}`}
                onPress={() => {
                  haptic.select();
                  setDose(k);
                }}
                testID={`med-dose-${k}`}
                style={{ minHeight: 56, paddingHorizontal: space[4], paddingVertical: space[2], justifyContent: "center", borderRadius: layout.radius, borderWidth: 1.5, borderColor: k === dose ? c.ink : c.cardLine, backgroundColor: k === dose ? c.primary : "transparent" }}
              >
                <T v="caption" style={{ color: k === dose ? c.onPrimary : c.muted }}>
                  {x.label}
                </T>
                <T v="bodyStrong" style={{ color: k === dose ? c.onPrimary : c.ink }}>
                  {x.amount}
                </T>
              </Pressable>
            ))}
          </ScrollView>
          {d ? (
            <View style={{ gap: space[2] }}>
              <T v="small" tone="muted">
                {d.use}
              </T>
              <T v="reading">{view === "student" ? d.student : d.clinician}</T>
              {d.watch?.length ? (
                <Fact name="Watch for at this dose">
                  <Bullets items={d.watch} />
                </Fact>
              ) : null}
            </View>
          ) : null}
          {tell.take.length ? (
            <Fact name="How to take it">
              <Bullets items={tell.take} />
            </Fact>
          ) : null}
          <Fact name="Forms">{med.forms}</Fact>
          <Fact name="Indian brands">{med.brands.join(", ")}</Fact>
          <T v="small" tone="muted">
            {DOSE_NOTE}
          </T>
        </Part>

        <Part shown={sections} onAt={at} id="side-effects">
          <Bullets items={med.common} />
        </Part>
        <Part shown={sections} onAt={at} id="monitoring">
          <Bullets items={med.checks} />
        </Part>
        <Part shown={sections} onAt={at} id="interactions">
          <Bullets items={med.interactions} />
        </Part>
        {/* The one band of colour on the page. */}
        <View onLayout={at("warnings")} testID="med-section-warnings" style={{ gap: space[3], backgroundColor: c.alertBg, borderRadius: layout.radius, padding: space[4] }}>
          <T v="h2" tone="alert">
            {SECTION_NAMES.warnings}
          </T>
          <Bullets items={[...med.serious, ...tell.warn]} tone="alert" />
        </View>
        <Part shown={sections} onAt={at} id="groups">
          {med.groups.map((g) => (
            <Fact key={g.label} name={g.label}>
              {g.text}
            </Fact>
          ))}
        </Part>
        <Part shown={sections} onAt={at} id="stopping">
          <Bullets items={[...tell.stopping, ...(half ? [washoutLine(half.hl)] : [])]} />
        </Part>

        {related.length || study ? (
          <View style={{ gap: space[3] }}>
            {related.length ? (
              <>
                <T v="h3">Related</T>
                <RowList>
                  {related.map((r) => (
                    <Row key={r.id} title={r.name} meta={r.cls} onPress={() => router.push(`/medicine/${encodeURIComponent(r.id)}`)} testID={`med-related-${r.id}`} />
                  ))}
                </RowList>
              </>
            ) : null}
            {study ? (
              <RowList>
                <Row title={`Learn it in Study: ${study.title}`} icon={<BookOpen size={20} color={c.muted} />} onPress={() => openTarget(study.target)} />
              </RowList>
            ) : null}
          </View>
        ) : null}

        <Part shown={sections} onAt={at} id={HOW_IT_WORKS}>
          {mech ? (
            <>
              <T v="reading">{mech.plain}</T>
              <View style={{ borderTopWidth: 1.5, borderColor: c.ink }}>
                {mech.targets.map((t) => (
                  <View key={t.target} style={{ gap: 2, paddingVertical: space[3], borderBottomWidth: 1, borderColor: c.hairline }}>
                    <T v="bodyStrong">{t.target}</T>
                    {view === "clinician" ? <T v="small">{t.action}</T> : null}
                    <T v="small" tone="muted">
                      {t.effect}
                    </T>
                  </View>
                ))}
              </View>
              <T v="small" tone="muted">
                Where it acts: {mech.site}
              </T>
            </>
          ) : null}
          <Diagrams visuals={visuals} mech={mech} />
        </Part>
      </ScrollView>

      <Sheet open={index} onClose={() => setIndex(false)} title="Sections" testID="med-index-sheet">
        <RowList>
          {sections.map((s) => (
            <Row
              key={s}
              title={SECTION_NAMES[s]}
              testID={`med-jump-${s}`}
              onPress={() => {
                setIndex(false);
                setTimeout(() => go(s), 220);
              }}
            />
          ))}
        </RowList>
      </Sheet>
      <ComparePicker open={comparing} onClose={() => setComparing(false)} from={med} />
    </View>
  );
}

/** Pick the second medicine for Compare: related ones first, then a search. */
function ComparePicker({ open, onClose, from }: { open: boolean; onClose: () => void; from: Med }) {
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
          <Row key={r.id} title={r.name} meta={r.cls} icon={<ClassMark group={r.group} />} onPress={() => pick(r.id)} testID={`compare-with-${r.id}`} />
        ))}
      </RowList>
      {!rows.length ? <Button kind="quiet" label="Close" onPress={onClose} /> : null}
    </Sheet>
  );
}
