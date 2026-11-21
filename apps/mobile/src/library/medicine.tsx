import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftRight, BookOpen, Dumbbell } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import { ApiFailure } from "@/api/errors";
import { Button, Label, LoadError, QuietEmpty, Row, RowList, RowsSkeleton, Sheet, StillTrying, T } from "@/ds";
import { recentMedicines } from "@/lib/recent";
import { openTarget } from "@/nav/targets";
import type { MedicinePage, MedSection } from "@/practise/contract";
import { fonts, layout, space, useTheme } from "@/theme";
import { Block, Bullets, FactStrip, JumpChips, LinkCard, LookupScreen, PairTable, PinButton, useJump } from "./kit";
import { useMedicineList, useMedicinePage } from "./list";
import { ClassMark } from "./marks";
import { MedicineDiagrams } from "./med-diagrams";
import { searchMeds } from "./meds";
import { pinnedMeds } from "./pins";

type View_ = "student" | "clinician";

/** "Serotonergic drugs: tramadol, triptans" reads as a label and its detail; a line with no colon is just the label. */
export function splitLine(line: string): { label: string; value: string } {
  const at = line.indexOf(": ");
  return at > 0 && at < 48 ? { label: line.slice(0, at), value: line.slice(at + 2) } : { label: line, value: "" };
}

/** A small label over its content, inside a section. */
function Sub({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: space[2] }}>
      <T v="label" tone="muted">
        {name}
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
 * stopping, How it works last with its pictures). The name sits on the field;
 * the layer opens with the key facts and a row of section names that jump.
 * Nothing in or around a dose moves.
 */
export function MedicineScreen() {
  const { id = "", section } = useLocalSearchParams<{ id: string; section?: string }>();
  const q = useMedicinePage(String(id));
  const openedId = q.data?.id;
  React.useEffect(() => {
    if (openedId) recentMedicines.add(openedId);
  }, [openedId]);
  if (q.isError && q.data === undefined) {
    const soon = q.error instanceof ApiFailure && q.error.code === "not_found";
    return (
      <LookupScreen testID="medicine-missing">
        {soon ? <QuietEmpty title="Not in the library yet" body="This medicine page arrives in the app soon." action={{ label: "See all medicines", onPress: () => router.replace("/medicines") }} /> : <LoadError error={q.error} what="this medicine" onRetry={() => void q.refetch()} />}
      </LookupScreen>
    );
  }
  if (!q.data) {
    return (
      <LookupScreen testID="medicine-loading">
        <RowsSkeleton rows={8} />
        <StillTrying failed={q.failureCount > 0} />
      </LookupScreen>
    );
  }
  return <MedicinePageView key={q.data.id} page={q.data} jump={section} />;
}

type Sec = MedSection;

export function MedicinePageView({ page, jump }: { page: MedicinePage; jump?: string }) {
  const c = useTheme();
  const [view, setView] = React.useState<View_>("student");
  const doses = page.sections.find((x): x is Extract<Sec, { id: "doses" }> => x.id === "doses");
  const [dose, setDose] = React.useState(doses?.defaultDose ?? 0);
  const [comparing, setComparing] = React.useState(false);
  const scroll = useJump();
  const jumped = React.useRef(false);
  const d = doses?.doses[dose] ?? doses?.doses[0];

  const at = (s: string) => (e: { nativeEvent: { layout: { y: number } } }) => {
    scroll.at(s)(e);
    if (!jumped.current && jump === s) {
      jumped.current = true;
      setTimeout(() => scroll.go(s), 250);
    }
  };

  const body = (x: Sec) => {
    switch (x.id) {
      case "uses":
        return (
          <>
            <Bullets items={x.uses.length ? x.uses : x.points} />
            {x.standout.length ? (
              <Sub name="What sets it apart">
                <Bullets items={x.standout} />
              </Sub>
            ) : null}
          </>
        );
      case "doses":
        return (
          <>
            {/* The choices share the width and their words wrap, so a long label is never cut at the edge. The picked one is ink; nothing slides or fades. */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }} accessibilityRole="tablist" accessibilityLabel="Doses">
              {x.doses.map((o, k) => (
                <Pressable
                  key={`${o.amount}-${k}`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: k === dose }}
                  accessibilityLabel={`${o.label}: ${o.amount}`}
                  onPress={() => setDose(k)}
                  testID={`med-dose-${k}`}
                  style={{ flexGrow: 1, flexBasis: "30%", minWidth: 96, minHeight: 60, paddingHorizontal: space[3], paddingVertical: space[2], justifyContent: "center", borderRadius: layout.radius, backgroundColor: k === dose ? c.ink : c.card }}
                >
                  <T v="caption" tone={k === dose ? "onInk" : "muted"}>
                    {o.label}
                  </T>
                  <T v="bodyStrong" num tone={k === dose ? "onInk" : "ink"}>
                    {o.amount}
                  </T>
                </Pressable>
              ))}
            </View>
            {d ? (
              <View style={{ gap: space[2] }} testID="med-dose-text">
                <T v="small" tone="muted">
                  {d.use}
                </T>
                <T v="reading">{view === "student" ? d.student : d.clinician}</T>
                {d.watch?.length ? (
                  <Sub name="Watch for at this dose">
                    <Bullets items={d.watch} />
                  </Sub>
                ) : null}
              </View>
            ) : null}
            {x.take.length ? (
              <Sub name="How to take it">
                <Bullets items={x.take} />
              </Sub>
            ) : null}
            <PairTable rows={[...(x.forms ? [{ label: "Forms", value: x.forms }] : []), ...(x.brands.length ? [{ label: "Brands in India", value: x.brands.join(", ") }] : [])]} />
            {x.note ? (
              <T v="caption" tone="muted">
                {x.note}
              </T>
            ) : null}
          </>
        );
      case "interactions":
        // Each line as its own row: what it mixes badly with, then what happens.
        return <PairTable testID="med-interactions" rows={x.points.map(splitLine)} />;
      case "groups":
        return <PairTable testID="med-groups" rows={x.facts.map((g) => ({ label: g.label, value: g.text }))} />;
      case "how-it-works":
        return (
          <>
            {x.plain ? <T v="reading">{x.plain}</T> : null}
            {x.targets.length ? <PairTable testID="med-targets" rows={x.targets.map((t) => ({ label: t.target, value: view === "clinician" ? `${t.action}. ${t.effect}` : t.effect }))} /> : null}
            <MedicineDiagrams diagrams={x.diagrams} />
          </>
        );
      default:
        return <Bullets items={x.points} tone={x.id === "warnings" ? "alert" : undefined} />;
    }
  };

  const how = page.sections.find((x) => x.id === "how-it-works");
  const rest = page.sections.filter((x) => x.id !== "how-it-works");
  const part = (x: Sec) => (
    <Block key={x.id} title={x.title} alert={x.id === "warnings"} onLayout={at(x.id)} testID={`med-section-${x.id}`}>
      {body(x)}
    </Block>
  );

  return (
    <>
      <LookupScreen
        testID="medicine"
        jump={scroll}
        gap={space[6]}
        tag={
          <View style={{ flexDirection: "row", alignItems: "center", gap: space[2] }}>
            <ClassMark group={page.group} onField />
            <T v="small" tone="onFieldMuted" style={{ flex: 1 }}>
              {page.group} · {page.cls}
            </T>
          </View>
        }
        title={page.name}
        sub={page.brands.length ? `Brands in India: ${page.brands.join(", ")}` : undefined}
        pin={<PinButton list={pinnedMeds} id={page.id} name={page.name} />}
      >
        <View style={{ gap: space[4] }}>
          <View accessibilityRole="radiogroup" accessibilityLabel="How much detail" style={{ alignSelf: "flex-start", flexDirection: "row", backgroundColor: c.card, borderRadius: 26, padding: 4 }}>
            {(["student", "clinician"] as const).map((v) => (
              <Pressable key={v} accessibilityRole="radio" accessibilityState={{ selected: view === v }} onPress={() => setView(v)} testID={`med-view-${v}`} style={{ minHeight: 44, paddingHorizontal: space[4], justifyContent: "center", borderRadius: 22, backgroundColor: view === v ? c.ink : "transparent" }}>
                <T v="small" tone={view === v ? "onInk" : "ink"} style={{ fontFamily: fonts.semibold }}>
                  {v === "student" ? "Plain words" : "For clinicians"}
                </T>
              </Pressable>
            ))}
          </View>
          <T v="reading" testID="med-summary">
            {view === "student" ? page.summary.student : page.summary.clinician}
          </T>
          <FactStrip facts={[page.dose ? { label: "Usual dose", value: page.dose } : null, page.halfLife?.hl ? { label: "Half-life", value: page.halfLife.hl } : null]} />
          <JumpChips items={page.sections.map((x) => ({ id: x.id, name: x.title }))} onJump={scroll.go} />
        </View>

        {rest.map(part)}

        <View style={{ gap: space[2] }}>
          <Label>Go deeper</Label>
          <LinkCard
            items={[
              { testID: "med-compare", title: "Compare with another medicine", meta: "Side by side, fact by fact", icon: <ArrowLeftRight size={20} color={c.ink} />, onPress: () => setComparing(true) },
              page.study ? { testID: "med-study", title: `Learn it in Study: ${page.study.title}`, icon: <BookOpen size={20} color={c.ink} />, onPress: () => openTarget(page.study!.target) } : null,
              { testID: "med-practise", title: "Rx Detective", meta: "Practise medicines, receptors and risky mixes", icon: <Dumbbell size={20} color={c.ink} />, onPress: () => router.push("/game/rx") },
            ]}
          />
        </View>
        {page.related.length ? (
          <View style={{ gap: space[2] }}>
            <Label>Related</Label>
            <PairTable rows={page.related.map((r) => ({ label: r.name, value: r.cls, testID: `med-related-${r.id}`, onPress: () => router.push(`/medicine/${encodeURIComponent(r.id)}`) }))} />
          </View>
        ) : null}

        {how ? part(how) : null}
      </LookupScreen>
      <ComparePicker open={comparing} onClose={() => setComparing(false)} from={{ id: page.id, name: page.name, cls: page.cls, related: page.related.map((r) => r.id) }} />
    </>
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
