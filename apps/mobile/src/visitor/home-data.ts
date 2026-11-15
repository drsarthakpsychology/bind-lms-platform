/**
 * The Welcome words, live from the website (GET /public/home), with the
 * bundled copy in content.ts as the fallback: Welcome shows the bundled words
 * at once (and offline), and switches to the server's words when they arrive,
 * so a change on the website reaches the app without a release.
 *
 * `PublicHome` mirrors the server's type (src/lib/app-api/contract.ts on the
 * website, docs/app/API_CONTRACT.md). It lives here, not in src/api/contract.ts,
 * until the app's contract copy is re-synced; then import it from there.
 * Only the fields Welcome uses are listed. The server never sends which
 * cohort is running.
 */
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { api } from "@/auth";
import * as B from "./content";

type Head = { tag: string; title: string; accent: string };
type TitleText = { title: string; text: string };
export type PublicHome = {
  v: 1;
  hero: { title: string[]; lede: string; highlights: string[]; quickAnswers: { q: string; a: string; section: string }[] };
  sections: {
    programme: { head: Head; stats: { n: string; text: string }[]; certificate: string; manifesto: string };
    patients: { head: Head; steps: TitleText[] };
    different: { head: Head; rows: { college: string; vibha: string }[] };
    disorders: { head: Head; journey: { disorder: string; patient: string; steps: { k: string; title: string; text: string }[]; foot: string } };
    week: { head: Head; weekday: { tag: string; title: string; sub: string; steps: string[] }; weekend: { tag: string; title: string; sub: string; steps: string[] }; days: { d: string; kind: "patient" | "live"; time: string | null }[] };
    faculty: { head: Head; lead: { initials: string; role: string; name: string; text: string }; faculty: { initials: string; name: string; role: string }[]; leadership: { name: string; role: string }[] };
    fees: { head: Head; dependsOn: string[]; pay: string[]; joinSteps: TitleText[]; whoFor: TitleText[] };
    curriculum: { head: Head; disciplines: { name: string; text: string }[] };
    closing: { title: string[] };
  };
  contact: { phone: string; phoneHref: string; whatsappHref: string; address: string[] };
};

/** Everything Welcome shows. Same shape as the bundled copy. */
export type HomeWords = {
  HERO: { lines: readonly [string, string, string]; lede: string; bubble: string };
  STICKERS: readonly string[];
  QUICK_ANSWERS: readonly { q: string; a: string }[];
  PATIENTS: typeof B.PATIENTS;
  DIFFERENT: { tag: string; title: string; accent: string; sub: string; rows: readonly { college: string; vibha: string }[]; manifesto: string };
  JOURNEY: { tag: string; title: string; accent: string; disorder: string; patient: string; steps: readonly (typeof B.JOURNEY.steps)[number][]; foot: string };
  GET: { tag: string; title: string; accent: string; stats: readonly { n: string; t: string }[]; certificate: string };
  DISCIPLINES: { tag: string; title: string; accent: string; sub: string; items: readonly { name: string; text: string }[] };
  WEEK: { tag: string; title: string; accent: string; sub: string; days: readonly { d: string; live: boolean }[]; weekday: { tag: string; title: string; sub: string; steps: readonly string[] }; weekend: { tag: string; title: string; sub: string; steps: readonly string[] } };
  FACULTY: { tag: string; title: string; accent: string; sub: string; lead: { initials: string; role: string; name: string; text: string }; people: readonly { initials: string; name: string; role: string }[]; note: string; runBy: readonly { name: string; role: string }[] };
  JOIN: typeof B.JOIN;
  CLOSING: { a: string; b: string; phone: string; phoneHref: string; whatsappHref: string; address: string };
};

export const BUNDLED: HomeWords = {
  HERO: B.HERO,
  STICKERS: B.STICKERS,
  QUICK_ANSWERS: B.QUICK_ANSWERS,
  PATIENTS: B.PATIENTS,
  DIFFERENT: B.DIFFERENT,
  JOURNEY: B.JOURNEY,
  GET: B.GET,
  DISCIPLINES: B.DISCIPLINES,
  WEEK: B.WEEK,
  FACULTY: B.FACULTY,
  JOIN: B.JOIN,
  CLOSING: B.CLOSING,
};

const txt = (v: unknown, fallback: string): string => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const list = <T,>(v: unknown, min = 1): T[] | null => (Array.isArray(v) && v.length >= min ? (v as T[]) : null);
const head = <H extends { tag: string; title: string; accent: string }>(h: Partial<Head> | undefined, b: H): H => ({ ...b, tag: txt(h?.tag, b.tag), title: txt(h?.title, b.title), accent: txt(h?.accent, b.accent) });
/** Words that must never reach the visitor screens (owner rule: no cohort talk, no dashes). */
const clean = (s: string) => s.replace(/\s*[–—]\s*/g, ", ");

/**
 * The server's words over the bundled ones, field by field: anything missing,
 * empty or the wrong shape keeps the bundled words. The drawings (who is in
 * each step, which icon) stay the app's own and follow the order.
 */
export function adaptHome(p: Partial<PublicHome> | null | undefined): HomeWords {
  if (!p || p.v !== 1 || !p.sections || !p.hero) return BUNDLED;
  const s = p.sections;
  const b = BUNDLED;
  const lines = list<string>(p.hero.title, 3);
  const steps = list<TitleText>(s.patients?.steps);
  const jSteps = list<{ k: string; title: string; text: string }>(s.disorders?.journey?.steps);
  const who = list<TitleText>(s.fees?.whoFor);
  const out: HomeWords = {
    HERO: { lines: lines ? [lines[0]!, lines[1]!, lines[2]!] : b.HERO.lines, lede: txt(p.hero.lede, b.HERO.lede), bubble: b.HERO.bubble },
    STICKERS: list<string>(p.hero.highlights, 3) ?? b.STICKERS,
    QUICK_ANSWERS: list<{ q: string; a: string }>(p.hero.quickAnswers)?.map((x) => ({ q: x.q, a: x.a })) ?? b.QUICK_ANSWERS,
    PATIENTS: { ...head(s.patients?.head, b.PATIENTS), steps: steps ? steps.map((x, i) => ({ title: x.title, text: x.text, heads: b.PATIENTS.steps[i % b.PATIENTS.steps.length]!.heads })) : b.PATIENTS.steps } as HomeWords["PATIENTS"],
    DIFFERENT: { ...head(s.different?.head, b.DIFFERENT), rows: list<{ college: string; vibha: string }>(s.different?.rows) ?? b.DIFFERENT.rows, manifesto: txt(s.programme?.manifesto, b.DIFFERENT.manifesto) },
    JOURNEY: {
      ...head(s.disorders?.head, b.JOURNEY),
      disorder: txt(s.disorders?.journey?.disorder, b.JOURNEY.disorder),
      patient: txt(s.disorders?.journey?.patient, b.JOURNEY.patient),
      steps: jSteps ? jSteps.map((x, i) => ({ ...x, icon: b.JOURNEY.steps[i % b.JOURNEY.steps.length]!.icon })) : b.JOURNEY.steps,
      foot: txt(s.disorders?.journey?.foot, b.JOURNEY.foot),
    },
    GET: { ...head(s.programme?.head, b.GET), stats: list<{ n: string; text: string }>(s.programme?.stats)?.slice(0, 6).map((x) => ({ n: x.n, t: x.text })) ?? b.GET.stats, certificate: txt(s.programme?.certificate, b.GET.certificate) },
    DISCIPLINES: { ...head(s.curriculum?.head, b.DISCIPLINES), items: list<{ name: string; text: string }>(s.curriculum?.disciplines) ?? b.DISCIPLINES.items },
    WEEK: {
      ...head(s.week?.head, b.WEEK),
      days: list<{ d: string; kind: string }>(s.week?.days, 7)?.map((x) => ({ d: x.d, live: x.kind === "live" })) ?? b.WEEK.days,
      weekday: s.week?.weekday && list(s.week.weekday.steps) ? s.week.weekday : b.WEEK.weekday,
      weekend: s.week?.weekend && list(s.week.weekend.steps) ? s.week.weekend : b.WEEK.weekend,
    },
    FACULTY: {
      ...head(s.faculty?.head, b.FACULTY),
      lead: s.faculty?.lead?.name ? s.faculty.lead : b.FACULTY.lead,
      people: list<{ initials: string; name: string; role: string }>(s.faculty?.faculty) ?? b.FACULTY.people,
      runBy: list<{ name: string; role: string }>(s.faculty?.leadership) ?? b.FACULTY.runBy,
    },
    JOIN: {
      ...head(s.fees?.head, b.JOIN),
      who: who ? who.slice(0, 4).map((x, i) => ({ title: x.title, text: x.text, who: b.JOIN.who[i % b.JOIN.who.length]!.who })) : b.JOIN.who,
      dependsOn: list<string>(s.fees?.dependsOn) ?? b.JOIN.dependsOn,
      pay: list<string>(s.fees?.pay) ?? b.JOIN.pay,
      steps: list<TitleText>(s.fees?.joinSteps) ?? b.JOIN.steps,
    } as HomeWords["JOIN"],
    CLOSING: {
      ...b.CLOSING,
      a: txt(s.closing?.title?.[0], b.CLOSING.a),
      b: txt(s.closing?.title?.[1], b.CLOSING.b),
      phone: txt(p.contact?.phone, b.CLOSING.phone),
      phoneHref: txt(p.contact?.phoneHref, b.CLOSING.phoneHref),
      whatsappHref: txt(p.contact?.whatsappHref, b.CLOSING.whatsappHref),
      address: list<string>(p.contact?.address)?.join(" ").replace(/,\s*$/, "") ?? b.CLOSING.address,
    },
  };
  // Last guard: if the server ever sent cohort talk, keep the bundled words for the whole screen.
  const all = JSON.stringify(out);
  if (/cohort/i.test(all)) return BUNDLED;
  return JSON.parse(clean(all)) as HomeWords;
}

/** The words for Welcome: bundled at once, the website's when they arrive (cached for an hour, kept offline). */
export function useHomeWords(): HomeWords {
  const q = useQuery({ queryKey: ["public-home"], queryFn: () => api.get<PublicHome>("/public/home", { auth: false }), staleTime: 60 * 60_000, gcTime: 7 * 24 * 60 * 60_000, retry: 1 });
  return React.useMemo(() => adaptHome(q.data), [q.data]);
}

export const HomeWordsCtx = React.createContext<HomeWords>(BUNDLED);
export const useWords = () => React.useContext(HomeWordsCtx);
