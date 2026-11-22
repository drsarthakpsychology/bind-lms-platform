import { useLocalSearchParams } from "expo-router";
import { Bookmark, GitCompareArrows, Pill } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

import { go } from "@/api/prefetch";
import { Chips, Label, QuietEmpty, Row, RowList, RowsSkeleton, T } from "@/ds";
import { Enter } from "@/motion";
import { space, useTheme } from "@/theme";
import { KindTag, Loads, LookupScreen, SearchField } from "./kit";
import { nameScore, normQuery, pinnedQuick, recentQuick, useQuickLibrary, useQuickSearch } from "./quick-notes";
import type { QuickItem, QuickLibrary, QuickType } from "./quick-notes-types";

const TAG: Record<QuickType, string> = { criteria: "Criteria", summary: "Summary", differential: "Differential", distinction: "Compare", theory: "Theory", therapy: "Therapy", pharm: "Medicine", assessment: "Assessment", term: "Word", exam: "Exam points" };
/** Long types show a first slice here; the rest are a tap away. */
const CAP = 24;

function ItemRow({ i, snippet, testID, tag = true }: { i: QuickItem; snippet?: string | null; testID?: string; /** Off inside a one-type shelf, where it would repeat the chip. */ tag?: boolean }) {
  return <Row testID={testID ?? `qn-row-${i.key}`} title={i.title} meta={snippet ?? i.line} trailing={tag ? <KindTag>{TAG[i.type]}</KindTag> : undefined} onPress={() => go(i.app)} chevron accessibilityLabel={`${i.title}. ${TAG[i.type]}. ${snippet ?? i.line}`} />;
}

function useDebounced(v: string, ms = 180) {
  const [d, setD] = React.useState(v);
  React.useEffect(() => {
    const t = setTimeout(() => setD(v), ms);
    return () => clearTimeout(t);
  }, [v, ms]);
  return d;
}

/** Results for a search: name matches at once, then what the server found inside the notes. */
function Results({ lib, text }: { lib: QuickLibrary; text: string }) {
  const q = normQuery(text);
  const dq = useDebounced(q);
  const s = useQuickSearch(dq);
  const byKey = React.useMemo(() => new Map(lib.items.map((i) => [i.key, i])), [lib.items]);
  const rows = React.useMemo(() => {
    const out: { i: QuickItem; snippet: string | null }[] = [];
    const seen = new Set<string>();
    const fresh = s.data && normQuery(s.data.q) === dq && dq === q;
    if (fresh)
      for (const h of s.data!.hits) {
        const i = byKey.get(h.key);
        if (i && !seen.has(i.key)) {
          seen.add(i.key);
          out.push({ i, snippet: h.snippet });
        }
      }
    const names = lib.items
      .filter((i) => !seen.has(i.key))
      .map((i) => ({ i, n: nameScore(i, q) }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n || a.i.title.localeCompare(b.i.title))
      .slice(0, 20)
      .map((x) => ({ i: x.i, snippet: null }));
    return (fresh ? [...out, ...names] : [...names, ...out]).slice(0, 40);
  }, [s.data, q, dq, lib.items, byKey]);
  const waiting = s.isFetching || dq !== q;
  return (
    <View style={{ gap: space[2] }} testID="qn-results">
      <Label>{waiting && !rows.length ? "Searching" : "Results"}</Label>
      {rows.length ? (
        <RowList still bare>
          {rows.map(({ i, snippet }) => (
            <ItemRow key={i.key} i={i} snippet={snippet} />
          ))}
        </RowList>
      ) : waiting ? (
        <RowsSkeleton rows={3} />
      ) : (
        <QuietEmpty testID="qn-none" title="Nothing matches" body="Try a shorter word or another spelling." />
      )}
    </View>
  );
}

function Mine({ lib }: { lib: QuickLibrary }) {
  const pins = pinnedQuick.use();
  const recent = recentQuick.use();
  const byKey = React.useMemo(() => new Map(lib.items.map((i) => [i.key, i])), [lib.items]);
  const pinned = pins.map((k) => byKey.get(k)).filter((i): i is QuickItem => !!i);
  const opened = recent.filter((k) => !pins.includes(k)).map((k) => byKey.get(k)).filter((i): i is QuickItem => !!i).slice(0, 4);
  if (!pinned.length && !opened.length) return null;
  return (
    <>
      {pinned.length ? (
        <View style={{ gap: space[2] }} testID="qn-pinned">
          <Label>Pinned</Label>
          <RowList bare>
            {pinned.map((i) => (
              <ItemRow key={i.key} i={i} testID={`qn-pin-${i.key}`} />
            ))}
          </RowList>
        </View>
      ) : null}
      {opened.length ? (
        <View style={{ gap: space[2] }} testID="qn-recent">
          <Label>Recently opened</Label>
          <RowList bare>
            {opened.map((i) => (
              <ItemRow key={i.key} i={i} testID={`qn-recent-${i.key}`} />
            ))}
          </RowList>
        </View>
      ) : null}
    </>
  );
}

/** One type's notes, by topic, A to Z. Words and medicine pages show a first slice and a way to the full list. */
function Shelf({ lib, type }: { lib: QuickLibrary; type: QuickType }) {
  const c = useTheme();
  const items = lib.items.filter((i) => i.type === type);
  const groups = lib.topics.map((t) => ({ ...t, items: items.filter((i) => i.topic === t.id).sort((a, b) => a.title.localeCompare(b.title)) })).filter((g) => g.items.length);
  const long = items.length > CAP;
  let left = CAP;
  return (
    <View style={{ gap: space[5] }} testID={`qn-shelf-${type}`}>
      {groups.map((g) => {
        if (long && left <= 0) return null;
        const shown = long ? g.items.slice(0, left) : g.items;
        left -= shown.length;
        return (
          <View key={g.id} style={{ gap: space[2] }}>
            <Label>{g.label}</Label>
            <RowList bare still={shown.length > 12}>
              {shown.map((i) => (
                <ItemRow key={i.key} i={i} tag={false} />
              ))}
            </RowList>
          </View>
        );
      })}
      {long ? (
        type === "term" ? (
          <Row testID="qn-all-words" title="Every word, A to Z" icon={<Bookmark size={20} color={c.ink} />} onPress={() => go("/reference")} chevron />
        ) : type === "pharm" ? (
          <Row testID="qn-all-medicines" title="The medicine library" meta="Every medicine, doses and groups" icon={<Pill size={20} color={c.ink} />} onPress={() => go("/medicines")} chevron />
        ) : (
          <T v="small" tone="muted">
            Search to find the rest.
          </T>
        )
      ) : null}
    </View>
  );
}

/**
 * Quick Notes, browsed: search inside every note, pinned and recent, one row
 * of type chips and that type's notes by topic. The Notes side of the Study
 * tab and the /notes screen both draw this.
 */
export function QuickBrowse({ initialType, initialQuery = "", also = true }: { initialType?: QuickType; initialQuery?: string; also?: boolean }) {
  const c = useTheme();
  const q = useQuickLibrary();
  const [text, setText] = React.useState(initialQuery);
  const [type, setType] = React.useState<QuickType>(initialType ?? "criteria");
  return (
    <View testID="quick-browse" style={{ gap: space[5] }}>
      <Enter i={0}>
        <SearchField testID="qn-search" value={text} onChange={setText} placeholder="Search: ADHD, lithium level" label="Search every Quick Note" />
      </Enter>
      <Loads q={q} what="Quick Notes" skeleton={<RowsSkeleton rows={6} />}>
        {(lib) =>
          normQuery(text) ? (
            <Results lib={lib} text={text} />
          ) : (
            <View style={{ gap: space[5] }}>
              <Mine lib={lib} />
              <View style={{ gap: space[3] }}>
                <Label>Browse</Label>
                <Chips scroll label="Show" options={lib.types.map((t) => ({ id: t.id, name: t.label }))} value={lib.types.some((t) => t.id === type) ? type : (lib.types[0]?.id ?? "criteria")} onChange={setType} />
              </View>
              <Shelf lib={lib} type={lib.types.some((t) => t.id === type) ? type : (lib.types[0]?.id ?? "criteria")} />
              {also ? (
                <View style={{ gap: space[2] }}>
                  <Label>Also here</Label>
                  <RowList bare>
                    <Row testID="hub-medicines" title="Medicine library" meta="Doses and groups" icon={<Pill size={20} color={c.ink} />} onPress={() => go("/medicines")} chevron />
                    <Row testID="hub-compare" title="Compare two medicines" icon={<GitCompareArrows size={20} color={c.ink} />} onPress={() => go("/medicine/compare")} chevron />
                    <Row testID="hub-saved" title="Saved" meta="Your bookmarks and notes" icon={<Bookmark size={20} color={c.ink} />} onPress={() => go("/saved")} chevron />
                  </RowList>
                </View>
              ) : null}
            </View>
          )
        }
      </Loads>
    </View>
  );
}

const TYPES: QuickType[] = ["criteria", "summary", "differential", "distinction", "theory", "therapy", "pharm", "assessment", "term", "exam"];

/** /notes: Quick Notes on its own screen (old links to the revision notes list land here). Takes ?type= and ?q=. */
export function QuickNotesScreen() {
  const { type, q } = useLocalSearchParams<{ type?: string; q?: string }>();
  const t = TYPES.find((x) => x === type);
  return (
    <LookupScreen testID="quick-notes" tag="Study" title="Quick Notes" sub="Criteria, comparisons, medicines, therapies and words">
      <QuickBrowse initialType={t} initialQuery={typeof q === "string" ? q.slice(0, 80) : ""} also={false} />
    </LookupScreen>
  );
}
