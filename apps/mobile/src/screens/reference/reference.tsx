import { router, Stack, useLocalSearchParams } from "expo-router";
import { BookOpen, Dumbbell, NotebookText, Pill, Pin } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";

import type { RefEntry, RefIndexItem, RefKind } from "@/api/adapt-learn";
import { useTerm, useTerms } from "@/api/learn";
import { go } from "@/api/prefetch";
import { Button, Chips, Label, QuietEmpty, Row, RowList, RowsSkeleton, Screen, Sheet, Skeleton, Stone, T, useProgressive } from "@/ds";
import { Block, Bullets, FactStrip, LinkCard, Loads, LookupScreen, QuietError, PairTable, PinButton, SearchField, type Fact } from "@/library/kit";
import { pinnedRefs, recentRefs } from "@/library/pins";
import { ReadingSize } from "@/lib/reading";
import { Enter, Reveal } from "@/motion";
import { Rich } from "@/study/rich";
import { layout, space, useTheme } from "@/theme";

/**
 * Quick reference: the website's A to Z of disorders, medicines and terms
 * (/study/reference). Search first, one row of kind chips, then the rows.
 * The whole index is a few hundred short rows, so it is searched on the
 * phone as you type.
 */

const KIND_WORD: Record<RefKind, string> = { disorder: "Disorder", medicine: "Medicine", term: "Term" };
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Rows that match the words, best first: the name, then a name it also goes by, then the summary. */
export function searchRefs(items: RefIndexItem[], words: string, kind: RefKind | "all" = "all"): RefIndexItem[] {
  const q = norm(words);
  const pool = kind === "all" ? items : items.filter((r) => r.kind === kind);
  if (!q) return pool;
  const scored: { r: RefIndexItem; s: number }[] = [];
  for (const r of pool) {
    const label = norm(r.label);
    const aliases = r.aliases.map(norm);
    let s = 0;
    if (label === q || aliases.includes(q)) s = 4;
    else if (label.startsWith(q) || aliases.some((a) => a.startsWith(q))) s = 3;
    else if (label.includes(q) || aliases.some((a) => a.includes(q))) s = 2;
    else if (norm(r.summary).includes(q)) s = 1;
    if (s) scored.push({ r, s });
  }
  return scored.sort((a, b) => b.s - a.s || a.r.label.localeCompare(b.r.label)).map((x) => x.r);
}

/** The entry a glossary word in the text points at, if the index has it. */
export function findRef(items: RefIndexItem[], word: string): RefIndexItem | null {
  const hits = searchRefs(items, word);
  const best = hits[0];
  return best && norm(best.label) === norm(word) ? best : best && best.aliases.map(norm).includes(norm(word)) ? best : (hits.length === 1 ? best : null) ?? null;
}

/** Only an entry whose name (or a name it also goes by) is exactly the word. */
export function exactRef(items: RefIndexItem[], word: string): RefIndexItem | null {
  const w = norm(word);
  if (!w) return null;
  return items.find((r) => norm(r.label) === w || r.aliases.some((a) => norm(a) === w)) ?? null;
}


/** A small square with the kind's first letter, so a mixed list reads at a glance (the kind is also written in the row). */
function KindMark({ kind }: { kind: RefKind }) {
  const c = useTheme();
  const a = kind === "disorder" ? c.areas.learn : kind === "medicine" ? c.areas.library : c.areas.me;
  return (
    <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: a.wash, alignItems: "center", justifyContent: "center" }}>
      <T v="label" style={{ color: a.deep }}>
        {kind === "disorder" ? "D" : kind === "medicine" ? "M" : "W"}
      </T>
    </View>
  );
}

export function ReferenceScreen() {
  const c = useTheme();
  const params = useLocalSearchParams<{ q?: string }>();
  const [q, setQ] = React.useState(typeof params.q === "string" ? params.q : "");
  const [kind, setKind] = React.useState<RefKind | "all">("all");
  const query = useTerms();
  const pinned = pinnedRefs.use();
  const recent = recentRefs.use();
  const n = query.data?.items.length;
  const open = (r: RefIndexItem) => go(`/reference/${encodeURIComponent(r.slug)}`);
  const row = (r: RefIndexItem, prefix = "ref", showKind = true) => (
    <Row
      key={r.slug}
      testID={`${prefix}-${r.slug}`}
      icon={<KindMark kind={r.kind} />}
      title={r.label}
      meta={showKind ? `${KIND_WORD[r.kind]} · ${r.summary}` : r.summary}
      trailing={pinned.includes(r.slug) ? <Pin size={16} color={c.muted} fill={c.muted} accessibilityLabel="Pinned" /> : undefined}
      chevron={false}
      onPress={() => open(r)}
    />
  );
  return (
    <Screen area="library" testID="reference" title="Quick reference" lead={n ? `${n} cards, A to Z` : "Disorders, medicines and words"} gap={space[5]} onRefresh={() => void query.refetch()} refreshing={query.isRefetching}>
      <View style={{ gap: space[3] }}>
        <SearchField testID="reference-search" value={q} onChange={setQ} placeholder="Search a disorder, medicine or word" label="Search the Quick reference" />
        <Chips
          scroll
          label="Show"
          options={[
            { id: "all", name: "All" },
            { id: "disorder", name: "Disorders" },
            { id: "medicine", name: "Medicines" },
            { id: "term", name: "Words" },
          ]}
          value={kind}
          onChange={setKind}
        />
      </View>
      <Loads q={query} soon="/study/reference" what="the Quick reference" skeleton={<RowsSkeleton rows={8} />}>
        {(d) => {
          const rows = searchRefs(d.items, q, kind);
          if (!d.items.length) return <QuietEmpty title="The Quick reference opens soon" body="Disorder cards, medicines and words show up here." testID="reference-none" />;
          if (!rows.length) return <QuietEmpty title="Nothing by that name" body="Try a shorter word, or the everyday word for it." action={{ label: "Clear the search", onPress: () => setQ("") }} testID="reference-empty" />;
          // Searching: one plain list, best match first. Browsing: grouped by letter.
          if (q.trim())
            return (
              <View style={{ gap: space[2] }}>
                <Label>{`${rows.length} ${rows.length === 1 ? "match" : "matches"}`}</Label>
                <RowList bare still>
                  {rows.slice(0, 60).map((r) => row(r))}
                </RowList>
              </View>
            );
          const byId = (ids: string[]) => ids.map((id) => d.items.find((r) => r.slug === id)).filter((r): r is RefIndexItem => !!r && (kind === "all" || r.kind === kind));
          const pins = byId(pinned);
          const recents = byId(recent)
            .filter((r) => !pinned.includes(r.slug))
            .slice(0, 3);
          return (
            <View style={{ gap: space[5] }}>
              {pins.length ? (
                <Enter i={0} style={{ gap: space[2] }}>
                  <Label>Pinned</Label>
                  <RowList bare>{pins.map((r) => row(r, "pinned"))}</RowList>
                </Enter>
              ) : null}
              {recents.length ? (
                <Enter i={1} style={{ gap: space[2] }}>
                  <Label>Recently opened</Label>
                  <RowList bare>{recents.map((r) => row(r, "recent"))}</RowList>
                </Enter>
              ) : null}
              <AToZ key={kind} rows={rows} row={(r) => row(r, "ref", kind === "all")} />
            </View>
          );
        }}
      </Loads>
    </Screen>
  );
}

/** Browsing: every entry by letter, drawn a part at a time (the full list is long). */
function AToZ({ rows, row }: { rows: RefIndexItem[]; row: (r: RefIndexItem) => React.ReactNode }) {
  const sorted = React.useMemo(() => [...rows].sort((a, b) => a.label.localeCompare(b.label)), [rows]);
  const shown = useProgressive(sorted.length);
  const letters: { letter: string; items: RefIndexItem[] }[] = [];
  for (const r of sorted.slice(0, shown)) {
    const L = /[a-z]/i.test(r.letter) ? r.letter.toUpperCase() : "#";
    const last = letters[letters.length - 1];
    if (last && last.letter === L) last.items.push(r);
    else letters.push({ letter: L, items: [r] });
  }
  return (
    <>
      {letters.map((g) => (
        <View key={g.letter} style={{ gap: space[1] }}>
          <Label>{g.letter}</Label>
          <RowList bare still={sorted.length > 40}>
            {g.items.map((r) => row(r))}
          </RowList>
        </View>
      ))}
    </>
  );
}

/* --------------------------------------------------------------- entry */

/**
 * Slots a disorder card is laid out for but the server does not send yet
 * (see docs/CONNECT-bnotes.md). Pass any of them and the card shows it in its
 * place: the facts join the strip at the top, the rest get their own block.
 */
export type CardExtra = {
  threshold?: string;
  onset?: string;
  settings?: string;
  impairment?: string;
  presentations?: { name: string; when: string }[];
  /** The lesson that teaches it. */
  lesson?: { title: string; href: string };
  /** Practice made for this card. */
  practice?: { title: string; meta?: string; href: string }[];
};

const TREATMENT_NOTE = "For learning. Real treatment is decided by the treating clinician.";

function Sayings({ items }: { items: string[] }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {items.map((x) => (
        <View key={x} style={{ maxWidth: "100%", paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: layout.radius, backgroundColor: c.card }}>
          <T v="small">“{x}”</T>
        </View>
      ))}
    </View>
  );
}

export function EntryBody({ e, labelOf, onOpen, extra }: { e: RefEntry; labelOf: (slug: string) => string | null; onOpen: (path: string) => void; extra?: CardExtra }) {
  const c = useTheme();
  const lead = e.kind === "disorder" ? e.core : e.kind === "medicine" ? (e.plain ?? e.cls) : e.means;
  const rich = (t: string) => <Rich text={t} />;
  return (
    <>
      <Enter i={0}>
        <Stone pad={space[5]} testID="ref-lead">
          <Rich text={lead} v="h3" />
        </Stone>
      </Enter>
      {e.kind === "disorder" ? (
        <>
          <FactStrip
            facts={[
              extra?.threshold ? { label: "Threshold", value: extra.threshold } : null,
              e.duration ? { label: "Duration", value: e.duration } : null,
              extra?.onset ? { label: "Age of onset", value: extra.onset } : null,
              extra?.settings ? { label: "Settings", value: extra.settings } : null,
              extra?.impairment ? { label: "Impairment", value: extra.impairment } : null,
            ] satisfies (Fact | null)[]}
          />
          {e.features.length ? (
            <Block title="Core features">
              <Bullets items={e.features} render={rich} />
            </Block>
          ) : null}
          {extra?.presentations?.length ? (
            <Block title="Presentation types" testID="ref-presentations">
              <PairTable rows={extra.presentations.map((p) => ({ label: p.name, value: p.when }))} />
            </Block>
          ) : null}
          {e.criteria.length ? (
            <Block title="Key criteria">
              <Bullets items={e.criteria} render={rich} />
            </Block>
          ) : null}
          {e.lookAlikes.length ? (
            <Block title="Look-alikes" note="How to tell each one apart.">
              <PairTable testID="ref-lookalikes" rows={e.lookAlikes.map((l) => ({ label: l.name, value: l.tell, testID: l.slug ? `ref-like-${l.slug}` : undefined, onPress: l.slug ? () => onOpen(`/reference/${encodeURIComponent(l.slug!)}`) : undefined }))} />
            </Block>
          ) : null}
          {e.firstLine.length ? (
            <Block title="First-line treatment" note={TREATMENT_NOTE}>
              <Bullets items={e.firstLine} render={rich} />
            </Block>
          ) : null}
          <View style={{ gap: space[2] }}>
            <Label>Go deeper</Label>
            <LinkCard
              testID="ref-links"
              items={[
                extra?.lesson ? { testID: "ref-lesson", title: extra.lesson.title, meta: "The lesson that teaches this", icon: <BookOpen size={20} color={c.ink} />, onPress: () => onOpen(extra.lesson!.href) } : null,
                e.noteId ? { testID: "ref-note", title: "Read the one-page note", meta: "The full summary for this topic", icon: <NotebookText size={20} color={c.ink} />, onPress: () => onOpen(`/notes/${encodeURIComponent(e.noteId!)}`) } : null,
              ]}
            />
          </View>
          <View style={{ gap: space[2] }}>
            <Label>Practise this</Label>
            <LinkCard
              items={[
                ...(extra?.practice ?? []).map((p) => ({ title: p.title, meta: p.meta, icon: <Dumbbell size={20} color={c.ink} />, onPress: () => onOpen(p.href) })),
                { testID: "ref-practise-detective", title: "Clinic detective", meta: "Name the disorder from clues", icon: <Dumbbell size={20} color={c.ink} />, onPress: () => onOpen("/case/detective") },
                { testID: "ref-practise-sort", title: "Criteria sort", meta: "Sort criteria into look-alike disorders", icon: <Dumbbell size={20} color={c.ink} />, onPress: () => onOpen("/game/sort") },
              ]}
            />
          </View>
        </>
      ) : e.kind === "medicine" ? (
        <>
          {e.uses.length ? (
            <Block title="Main uses">
              <Bullets items={e.uses} render={rich} />
            </Block>
          ) : null}
          {e.sideEffects.length ? (
            <Block title="Key side effects">
              <Bullets items={e.sideEffects} render={rich} />
            </Block>
          ) : null}
          {e.monitoring.length ? (
            <Block title="Monitoring">
              <Bullets items={e.monitoring} render={rich} />
            </Block>
          ) : null}
          {e.mechanism ? (
            <Block title="How it works">
              <Rich text={e.mechanism} v="reading" />
            </Block>
          ) : null}
          <T v="caption" tone="muted">
            For learning, not a prescription. Doses, interactions and cautions are on the medicine page.
          </T>
          <Button label="Open the medicine page" icon={<Pill size={20} color={c.onPrimary} />} onPress={() => onOpen(`/medicine/${encodeURIComponent(e.medId)}`)} testID="ref-medicine" />
          <LinkCard items={[{ testID: "ref-practise-rx", title: "Rx Detective", meta: "Medicines, receptors and risky mixes", icon: <Dumbbell size={20} color={c.ink} />, onPress: () => onOpen("/game/rx") }]} />
        </>
      ) : (
        <>
          {e.clinical ? (
            <Block title="Clinically">
              <Rich text={e.clinical} v="reading" />
            </Block>
          ) : null}
          {e.why ? (
            <Block title="Why clinicians use this word">
              <Rich text={e.why} v="reading" />
            </Block>
          ) : null}
          {e.mixup ? (
            <Block title="Often mixed up with">
              <Rich text={e.mixup} v="reading" />
            </Block>
          ) : null}
          {e.hook ? (
            <Block title="Memory hook">
              <Rich text={e.hook} v="reading" />
            </Block>
          ) : null}
          {e.sayings.length ? (
            <Block title="Patients may say">
              <Sayings items={e.sayings} />
            </Block>
          ) : null}
          {e.related.length ? (
            <Block title="Related">
              <PairTable rows={e.related.map((s) => ({ label: labelOf(s) ?? s.replace(/-/g, " "), value: "", testID: `ref-related-${s}`, onPress: () => onOpen(`/reference/${encodeURIComponent(s)}`) }))} />
            </Block>
          ) : null}
          <View style={{ gap: space[2] }}>
            <Label>Practise this</Label>
            <LinkCard items={[{ testID: "ref-practise-say", title: "Say it clinically", meta: "Everyday words into case-sheet words", icon: <Dumbbell size={20} color={c.ink} />, onPress: () => onOpen("/case/say-it") }]} />
          </View>
        </>
      )}
    </>
  );
}

export function ReferenceEntryScreen() {
  const { slug = "" } = useLocalSearchParams<{ slug: string }>();
  const id = String(slug);
  const q = useTerm(id);
  const index = useTerms();
  const labelOf = React.useCallback((s: string) => index.data?.items.find((r) => r.slug === s)?.label ?? null, [index.data]);
  const e = q.data;
  const found = !!e;
  React.useEffect(() => {
    if (found) recentRefs.add(id);
  }, [found, id]);
  const sub = e ? (e.kind === "disorder" ? [e.chapter, ...e.aka].filter(Boolean).join(" · ") : e.kind === "medicine" ? e.cls : (e.area ?? "")) : "";
  return (
    <LookupScreen testID="reference-entry" tag={e ? KIND_WORD[e.kind] : undefined} title={e?.label} sub={sub || undefined} onRefresh={() => void q.refetch()} refreshing={q.isRefetching} pin={e ? <PinButton list={pinnedRefs} id={id} name={e.label} /> : undefined}>
      <Stack.Screen options={{ title: "" }} />
      <Loads q={q} what="this entry" skeleton={<RowsSkeleton rows={5} />} missing={<QuietEmpty title="Not in the Quick reference" body="Search for it by another name." action={{ label: "Search", onPress: () => router.replace(`/reference?q=${encodeURIComponent(id.replace(/-/g, " "))}`) }} testID="reference-missing" />}>
        {(entry) =>
          entry ? (
            <ReadingSize>
              <View style={{ gap: space[6] }}>
                <EntryBody e={entry} labelOf={labelOf} onOpen={(p) => router.push(p)} />
              </View>
            </ReadingSize>
          ) : (
            <QuietEmpty title="Not in the Quick reference" body="Search for it by another name." action={{ label: "Search", onPress: () => router.replace(`/reference?q=${encodeURIComponent(id.replace(/-/g, " "))}`) }} testID="reference-missing" />
          )
        }
      </Loads>
    </LookupScreen>
  );
}

/* ---------------------------------------------------------- word sheet */

/**
 * A glossary word tapped while reading: the short meaning in a sheet, so the
 * place in the text is kept. "Open in the Quick reference" for the rest.
 */
export function TermSheet({ word, onClose }: { word: string | null; onClose: () => void }) {
  const index = useTerms(word !== null);
  const hit = word && index.data ? findRef(index.data.items, word) : null;
  const entry = useTerm(hit?.slug ?? "");
  const open = (path: string) => {
    onClose();
    router.push(path);
  };
  return (
    <Sheet open={word !== null} onClose={onClose} title={hit?.label ?? word ?? ""} testID="term-sheet">
      {(index.isError && index.data === undefined) || (entry.isError && entry.data === undefined) ? (
        <QuietError what="this word" error={index.isError ? index.error : entry.error} onRetry={() => void (index.isError ? index.refetch() : entry.refetch())} />
      ) : !index.data || (hit && !entry.data) ? (
        <View style={{ gap: space[3] }}>
          <Skeleton w="90%" h={18} />
          <Skeleton w="70%" h={18} />
        </View>
      ) : hit && entry.data ? (
        <Reveal style={{ gap: space[4] }}>
          <Rich text={entry.data.kind === "disorder" ? entry.data.core : entry.data.kind === "medicine" ? (entry.data.plain ?? entry.data.cls) : entry.data.means} v="reading" />
          {entry.data.kind === "term" && entry.data.clinical ? <Rich text={entry.data.clinical} tone="muted" /> : null}
          <Button kind="quiet" label="Open in the Quick reference" onPress={() => open(`/reference/${encodeURIComponent(hit.slug)}`)} testID="term-open" />
        </Reveal>
      ) : (
        <View style={{ gap: space[4] }}>
          <T tone="muted">This word is not in the Quick reference yet.</T>
          <Pressable accessibilityRole="button" onPress={() => open(`/reference?q=${encodeURIComponent(word ?? "")}`)} style={{ minHeight: layout.target, justifyContent: "center" }}>
            <T tone="link">Search the Quick reference</T>
          </Pressable>
        </View>
      )}
    </Sheet>
  );
}
