"use client";

import * as React from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import type { GenogramData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { SceneCard, btn, chip, statusCls, useReducedMotion } from "./kit";
import { Arrow, C, E, Label, P, Pg, R as Rect, Sheet } from "@/components/sketch/ink";

/**
 * A genogram builder for case work. Tap a person to add parents, siblings,
 * a partner or children, and to mark the condition (shaded), a death (cross)
 * or a divorce (two slashes). Then run the pattern finder, which sweeps the
 * generations and traces the condition through the family. Every person is
 * also listed in words, so nothing depends on the drawing or on colour.
 */

type Sex = "m" | "f" | "u";
type Role = "pgf" | "pgm" | "mgf" | "mgm" | "father" | "mother" | "paunt" | "maunt" | "older" | "younger" | "index" | "partner" | "child";
type Person = { id: string; role: Role; sex: Sex; age: string; cond: boolean; dead: boolean; note?: string };
type Geno = { people: Person[]; div: { parents: boolean; partner: boolean; pg: boolean; mg: boolean }; next: number };

const GEN: Record<Role, number> = { pgf: 0, pgm: 0, mgf: 0, mgm: 0, father: 1, mother: 1, paunt: 1, maunt: 1, older: 2, younger: 2, index: 2, partner: 2, child: 3 };
const SIDE: Partial<Record<Role, "father's" | "mother's">> = { pgf: "father's", pgm: "father's", paunt: "father's", father: "father's", mgf: "mother's", mgm: "mother's", maunt: "mother's", mother: "mother's" };

function nameOf(p: Person, all: Person[]): string {
  const g = (m: string, f: string, u: string) => (p.sex === "m" ? m : p.sex === "f" ? f : u);
  switch (p.role) {
    case "index": return "You (the patient)";
    case "pgf": return "Father's father";
    case "pgm": return "Father's mother";
    case "mgf": return "Mother's father";
    case "mgm": return "Mother's mother";
    case "father": return "Father";
    case "mother": return "Mother";
    case "paunt": return `Father's ${g("brother", "sister", "sibling")}`;
    case "maunt": return `Mother's ${g("brother", "sister", "sibling")}`;
    case "older": return `Older ${g("brother", "sister", "sibling")}`;
    case "younger": return `Younger ${g("brother", "sister", "sibling")}`;
    case "partner": return "Partner";
    case "child": {
      const kids = all.filter((x) => x.role === "child");
      return `${g("Son", "Daughter", "Child")} ${kids.indexOf(p) + 1}`;
    }
  }
}
const shortOf = (p: Person, all: Person[]) => {
  const g = (m: string, f: string, u: string) => (p.sex === "m" ? m : p.sex === "f" ? f : u);
  switch (p.role) {
    case "index": return "You";
    case "pgf": case "mgf": return "Grandpa";
    case "pgm": case "mgm": return "Grandma";
    case "paunt": case "maunt": return g("Uncle", "Aunt", "Aunt/uncle");
    case "older": case "younger": return g("Brother", "Sister", "Sibling");
    case "child": return g("Son", "Daughter", "Child");
    default: return nameOf(p, all);
  }
};

const empty = (): Geno => ({ people: [{ id: "p0", role: "index", sex: "f", age: "", cond: false, dead: false }], div: { parents: false, partner: false, pg: false, mg: false }, next: 1 });
function example(): Geno {
  const P = (id: string, role: Role, sex: Sex, age: string, cond = false, dead = false, note?: string): Person => ({ id, role, sex, age, cond, dead, note });
  return {
    people: [
      P("e1", "pgf", "m", "died at 70", true, true, "schizophrenia, a year in a mental hospital in his thirties"),
      P("e2", "pgm", "f", "74"),
      P("e3", "mgf", "m", "78"),
      P("e4", "mgm", "f", "72"),
      P("e5", "paunt", "m", "58", false, false, "well; his son died by suicide at 24"),
      P("e6", "father", "m", "55"),
      P("e7", "mother", "f", "50"),
      P("e8", "maunt", "f", "46"),
      P("e0", "index", "f", "23", true, false, "first episode of psychosis"),
      P("e9", "younger", "m", "20"),
    ],
    div: { parents: false, partner: false, pg: false, mg: false },
    next: 20,
  };
}

/* --------------------------------------------------------------- layout */
const W = 64, ROW = [44, 136, 228, 320], R = 13;
type Pos = Record<string, number>;
function layout(g: Geno): { x: Pos; w: number; left: number } {
  const by = (r: Role) => g.people.filter((p) => p.role === r);
  const one = (r: Role) => by(r)[0];
  const x: Pos = {};
  const father = one("father"), mother = one("mother");
  const row1 = [...by("paunt").reverse(), ...(father ? [father] : []), ...(mother ? [mother] : []), ...by("maunt")];
  row1.forEach((p, i) => (x[p.id] = i * W));
  // grandparents above each parent's sibship, kept apart
  const pSib = [...by("paunt"), ...(father ? [father] : [])];
  const mSib = [...(mother ? [mother] : []), ...by("maunt")];
  const mid = (ps: Person[]) => ps.reduce((a, p) => a + x[p.id], 0) / Math.max(1, ps.length);
  if (one("pgf")) {
    const m = mid(pSib);
    x[one("pgf").id] = m - W / 2;
    x[one("pgm").id] = m + W / 2;
  }
  if (one("mgf")) {
    let m = mid(mSib);
    const pgmX = one("pgm") ? x[one("pgm").id] : -1e9;
    const need = pgmX + W * 0.95 - (m - W / 2);
    if (need > 0) {
      mSib.forEach((p) => (x[p.id] += need));
      m += need;
    }
    x[one("mgf").id] = m - W / 2;
    x[one("mgm").id] = m + W / 2;
  }
  // you and your siblings, centred under your parents
  const sibs = [...by("older"), one("index"), ...by("younger")];
  const partner = one("partner");
  const row2 = [...by("older"), one("index"), ...(partner ? [partner] : []), ...by("younger")];
  row2.forEach((p, i) => (x[p.id] = i * W));
  if (father && mother) {
    const pm = (x[father.id] + x[mother.id]) / 2;
    const sm = mid(sibs);
    row2.forEach((p) => (x[p.id] += pm - sm));
  }
  // children under you and your partner
  const kids = by("child");
  if (partner && kids.length) {
    const cm = (x[one("index").id] + x[partner.id]) / 2;
    kids.forEach((k, i) => (x[k.id] = cm + (i - (kids.length - 1) / 2) * W));
  }
  const xs = Object.values(x);
  const left = Math.min(...xs) - W * 0.75;
  const right = Math.max(...xs) + W * 0.75;
  return { x, w: Math.max(right - left, W * 4), left };
}

/* --------------------------------------------------------------- pattern */
function bloodPath(p: Person): Role[] {
  switch (p.role) {
    case "pgf": case "pgm": return [p.role, "father", "index"];
    case "mgf": case "mgm": return [p.role, "mother", "index"];
    case "paunt": return ["paunt", "father", "index"];
    case "maunt": return ["maunt", "mother", "index"];
    default: return [p.role, "index"];
  }
}
const NUM = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const num = (n: number) => NUM[n] ?? String(n);

function findPattern(g: Geno, cond: string) {
  const aff = g.people.filter((p) => p.cond);
  if (!aff.length) return { text: `No one is marked with ${cond} yet.`, gens: 0, aff };
  const blood = aff.filter((p) => p.role !== "partner");
  if (!blood.length) return { text: "Only your partner is marked, and a partner is not a blood relative. Their condition matters for your children's risk, not for yours.", gens: 0, aff };
  const gens = new Set(blood.map((p) => GEN[p.role])).size;
  const fSide = blood.filter((p) => SIDE[p.role] === "father's");
  const mSide = blood.filter((p) => SIDE[p.role] === "mother's");
  const first = blood.filter((p) => ["father", "mother", "older", "younger", "child"].includes(p.role));
  const parts: string[] = [];
  parts.push(`${num(blood.length)} blood ${blood.length === 1 ? "relative has" : "relatives have"} ${cond}${blood.length ? `, across ${num(gens).toLowerCase()} ${gens === 1 ? "generation" : "generations"}` : ""}.`);
  if (fSide.length && !mSide.length) parts.push(`On the parents' side it runs only through the father's family (${fSide.map((p) => nameOf(p, g.people).toLowerCase()).join(", ")}).`);
  else if (mSide.length && !fSide.length) parts.push(`On the parents' side it runs only through the mother's family (${mSide.map((p) => nameOf(p, g.people).toLowerCase()).join(", ")}).`);
  else if (fSide.length && mSide.length) parts.push("It appears on both the father's and the mother's side.");
  if (first.length) parts.push(`${num(first.length)} of them ${first.length === 1 ? "is a first-degree relative" : "are first-degree relatives"} (parent, brother or sister, or child), who share about half their genes with the patient.`);
  const skipped = blood.some((p) => GEN[p.role] === 0) && !blood.some((p) => GEN[p.role] === 1) && blood.some((p) => GEN[p.role] === 2);
  if (skipped) parts.push("It seems to skip a generation: the parent in between is well. That is common, because people can carry a risk without becoming ill.");
  if (aff.some((p) => p.role === "partner")) parts.push("Your partner is not a blood relative, but matters for your children's risk.");
  parts.push(gens >= 2 ? "A condition that recurs across generations suggests a family loading (shared genes, and often shared surroundings too). Ask about age at onset, treatment and response in each relative." : "One generation only: shared genes and a shared upbringing are both possible explanations.");
  parts.push("Raised risk is not destiny: most relatives of a person with a mental illness never develop it.");
  return { text: parts.join(" "), gens, aff };
}

/* ---------------------------------------------------------------- scene */

export function Genogram({ d }: { d: GenogramData }) {
  const reduce = useReducedMotion();
  const cond = d.condition ?? "the condition";
  const [g, setG] = React.useState<Geno>(() => (d.start === "blank" ? empty() : example()));
  const [sel, setSel] = React.useState<string | null>(null);
  const [newSex, setNewSex] = React.useState<Sex>("f");
  const [scan, setScan] = React.useState<{ run: number; done: boolean } | null>(null);
  const [said, setSaid] = React.useState("");
  const L = layout(g);
  const by = (r: Role) => g.people.filter((p) => p.role === r);
  const has = (r: Role) => by(r).length > 0;
  const selP = g.people.find((p) => p.id === sel) ?? null;

  React.useEffect(() => {
    if (!scan || scan.done) return;
    const t = setTimeout(() => setScan((s) => (s && s.run === scan.run ? { ...s, done: true } : s)), reduce ? 0 : 2600);
    return () => clearTimeout(t);
  }, [scan, reduce]);

  const update = (fn: (g: Geno) => Geno, say: string) => {
    setG((x) => fn(x));
    setSaid(say);
    setScan(null);
  };
  const add = (role: Role, sex: Sex, say: string) => {
    update((x) => ({ ...x, people: [...x.people, { id: `p${x.next}`, role, sex, age: "", cond: false, dead: false }], next: x.next + 1 }), say);
    trackLearn({ type: "widget", kind: "genogram", item: `add-${role}` });
  };
  const addPair = (a: Role, b: Role, say: string) => {
    update((x) => ({ ...x, people: [...x.people, { id: `p${x.next}`, role: a, sex: "m", age: "", cond: false, dead: false }, { id: `p${x.next + 1}`, role: b, sex: "f", age: "", cond: false, dead: false }], next: x.next + 2 }), say);
  };
  const edit = (id: string, patch: Partial<Person>, say: string) => update((x) => ({ ...x, people: x.people.map((p) => (p.id === id ? { ...p, ...patch } : p)) }), say);
  const remove = (id: string) => {
    const p = g.people.find((x) => x.id === id)!;
    update((x) => ({ ...x, people: x.people.filter((q) => q.id !== id && !(p.role === "partner" && q.role === "child")) }), `${nameOf(p, g.people)} removed${p.role === "partner" ? ", with the children of that couple" : ""}.`);
    setSel(null);
  };

  const actions: { label: string; run: () => void; disabled?: boolean }[] = [];
  if (selP) {
    const r = selP.role;
    const nm = nameOf(selP, g.people);
    const sx = newSex === "m" ? "a brother" : newSex === "f" ? "a sister" : "a sibling";
    if (r === "index") {
      if (!has("father")) actions.push({ label: "Add parents", run: () => { addPair("father", "mother", "Parents added: a square (father) and a circle (mother) joined by a partner line, with a line down to you."); } });
      if (has("father")) {
        actions.push({ label: `Add older ${newSex === "m" ? "brother" : newSex === "f" ? "sister" : "sibling"}`, run: () => add("older", newSex, "Older sibling added on your left: in a genogram, brothers and sisters go from oldest on the left to youngest on the right."), disabled: by("older").length + by("younger").length >= 4 });
        actions.push({ label: `Add younger ${newSex === "m" ? "brother" : newSex === "f" ? "sister" : "sibling"}`, run: () => add("younger", newSex, "Younger sibling added on your right."), disabled: by("older").length + by("younger").length >= 4 });
      }
      if (!has("partner")) actions.push({ label: "Add partner", run: () => add("partner", selP.sex === "m" ? "f" : "m", "Partner added beside you, joined by a partner line.") });
      actions.push({ label: `Add ${newSex === "m" ? "son" : newSex === "f" ? "daughter" : "child"}`, run: () => {
        if (!has("partner")) update((x) => ({ ...x, people: [...x.people, { id: `p${x.next}`, role: "partner", sex: selP.sex === "m" ? "f" : "m", age: "", cond: false, dead: false }, { id: `p${x.next + 1}`, role: "child", sex: newSex, age: "", cond: false, dead: false }], next: x.next + 2 }), "A partner and a child added: children hang from the partner line.");
        else add("child", newSex, "Child added, hanging from the partner line, oldest on the left.");
      }, disabled: by("child").length >= 4 });
    }
    if ((r === "father" || r === "mother") && !has(r === "father" ? "pgf" : "mgf")) actions.push({ label: `Add ${r === "father" ? "father's" : "mother's"} parents`, run: () => { addPair(r === "father" ? "pgf" : "mgf", r === "father" ? "pgm" : "mgm", `Grandparents added on the ${r}'s side: that is the third generation.`); } });
    if (r === "father" || r === "mother") actions.push({ label: `Add ${r === "father" ? "father's" : "mother's"} ${sx.replace("a ", "")}`, run: () => add(r === "father" ? "paunt" : "maunt", newSex, `An aunt or uncle added beside the ${r}, sharing the line from the grandparents.`), disabled: by(r === "father" ? "paunt" : "maunt").length >= 3 });
    const divKey = r === "father" || r === "mother" ? "parents" : r === "pgf" || r === "pgm" ? "pg" : r === "mgf" || r === "mgm" ? "mg" : r === "partner" ? "partner" : null;
    if (divKey) {
      const on = g.div[divKey as keyof Geno["div"]];
      actions.push({ label: on ? "Not divorced" : "Mark this couple divorced", run: () => update((x) => ({ ...x, div: { ...x.div, [divKey]: !on } }), on ? "Divorce removed from the partner line." : "Divorce marked: two short slashes across the partner line (one slash would mean separated).") });
    }
    actions.push({ label: selP.cond ? `Does not have ${cond}` : `Has ${cond}`, run: () => { edit(selP.id, { cond: !selP.cond }, selP.cond ? `${nm}: shading removed.` : `${nm}: shape shaded to show ${cond}. Always write the diagnosis beside it too.`); } });
    actions.push({ label: selP.dead ? "Alive" : "Has died", run: () => { edit(selP.id, { dead: !selP.dead }, selP.dead ? `${nm}: marked alive.` : `${nm}: a cross through the shape shows death. Write the age and cause beside it.`); } });
    if (!["father", "mother", "pgf", "pgm", "mgf", "mgm", "index"].includes(r)) {
      actions.push({ label: `Make ${selP.sex === "m" ? "female" : "male"}`, run: () => edit(selP.id, { sex: selP.sex === "m" ? "f" : "m" }, "Shape changed: square for male, circle for female.") });
    }
  }

  const finder = scan ? findPattern(g, cond) : null;
  const runFinder = () => {
    setScan({ run: (scan?.run ?? 0) + 1, done: false });
    setSaid("");
    trackLearn({ type: "widget", kind: "genogram", item: "finder", score: g.people.filter((p) => p.cond).length });
  };
  const affIds = new Set(finder ? finder.aff.map((p) => p.id) : []);
  const gensUsed = g.people.map((p) => GEN[p.role]);
  const top = ROW[Math.min(...gensUsed)] - 40;
  const H = ROW[Math.max(...gensUsed)] + 52 - top;

  return (
    <SceneCard title={d.title ?? "Build the family tree"} caption={d.caption}>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => { setG(example()); setSel(null); setScan(null); setSaid("Example family: Ms N, 23, with a first episode of psychosis."); }}>Load the example</button>
        <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => { setG(empty()); setSel(null); setScan(null); setSaid("A blank genogram: just you."); }}>Start blank</button>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border-2 border-foreground bg-background">
        <Sheet bare name="genogram" left={L.left} top={top} w={L.w} h={H} label="The genogram drawing. Every person and line is also listed in words below." className="h-auto max-h-[26rem] w-full">
          <style>{`
            @keyframes gg-sweep { from { transform: translateY(0) } to { transform: translateY(${H}px) } }
            @keyframes gg-ring { 0% { transform: scale(0.6); opacity: 0 } 40% { opacity: 1 } 100% { transform: scale(1.6); opacity: 0 } }
            @keyframes gg-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
            @keyframes gg-in { from { transform: scale(0.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }
            .gg-p { transform-box: fill-box; transform-origin: center; animation: gg-in 320ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          `}</style>
          <Lines g={g} x={L.x} />
          {finder && !reduce && !scan?.done ? <rect x={L.left} y={top - 24} width={L.w} height="24" fill={C.lime} style={{ opacity: 0.5, animation: "gg-sweep 2.4s linear both" }} /> : null}
          {finder && (scan?.done || reduce) ? <TracePaths g={g} x={L.x} aff={finder.aff} reduce={reduce} /> : null}
          {g.people.map((p) => {
            const cx = L.x[p.id], cy = ROW[GEN[p.role]];
            const hit = affIds.has(p.id);
            return (
              <g key={p.id} onClick={() => { setSel(p.id === sel ? null : p.id); setSaid(""); }} className="cursor-pointer">
                <g className={reduce ? undefined : "gg-p"}>
                  <Symbol p={p} cx={cx} cy={cy} sel={sel === p.id} />
                </g>
                {hit ? <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke={C.red} strokeWidth={2.5} style={reduce ? undefined : { transformBox: "fill-box", transformOrigin: "center", animation: `gg-ring 1.2s ${0.4 + GEN[p.role] * 0.55}s ease-out 2 both` }} /> : null}
                <Label x={cx} y={cy + R + 15} size={12} anchor="middle">{shortOf(p, g.people)}</Label>
                {p.age ? <Label x={cx} y={cy + R + 28} size={11} anchor="middle" bold={false} color={C.soft}>{p.age.length > 9 ? p.age.replace("died at ", "d. ") : p.age}</Label> : null}
                <rect x={cx - W / 2 + 2} y={cy - R - 8} width={W - 4} height={R * 2 + 40} fill="transparent" />
              </g>
            );
          })}
        </Sheet>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
        <span>□ male</span><span>○ female</span><span>▨ shaded (hatched): has {cond}</span><span>✕ died</span><span>{"//"} divorced</span><span>double outline and arrow: the patient</span>
      </p>

      {selP ? (
        <div className="vibha-pop mt-3 rounded-xl border-2 border-foreground p-3">
          <p className="font-bold">{nameOf(selP, g.people)}{selP.age ? `, ${selP.age}` : ""}</p>
          {actions.some((a) => a.label.startsWith("Add")) ? (
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold" role="group" aria-label="New person is">
              <span>New person:</span>
              {(["m", "f"] as Sex[]).map((s) => <button key={s} type="button" aria-pressed={newSex === s} className={chip(newSex === s, "min-h-10 py-1")} onClick={() => setNewSex(s)}>{s === "m" ? "Male" : "Female"}</button>)}
            </div>
          ) : null}
          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {actions.map((a) => (
              <button key={a.label} type="button" disabled={a.disabled} className={cn(btn, "min-h-11 justify-start bg-card px-3 text-left text-sm disabled:opacity-40")} onClick={a.run}>
                {a.label.startsWith("Add") ? <UserPlus className="size-4 shrink-0" aria-hidden /> : null}{a.label}
              </button>
            ))}
            {selP.role !== "index" && selP.role !== "father" && selP.role !== "mother" && !["pgf", "pgm", "mgf", "mgm"].includes(selP.role) ? (
              <button type="button" className={cn(btn, "min-h-11 justify-start bg-card px-3 text-sm")} onClick={() => remove(selP.id)}><Trash2 className="size-4" aria-hidden /> Remove</button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-3">
        <button type="button" className={cn(btn, "min-h-12 bg-primary px-5 text-primary-foreground hover:-translate-y-0.5")} onClick={runFinder}>
          <Search className="size-4" aria-hidden /> Find the pattern
        </button>
      </div>
      <div className={statusCls} role="status" aria-live="polite">
        {finder ? (
          scan?.done || reduce ? <><span className="font-semibold">Pattern finder: </span>{finder.text}</> : <>Scanning the family generation by generation…</>
        ) : said ? said : `This family has ${g.people.length} ${g.people.length === 1 ? "person" : "people"} across ${new Set(g.people.map((p) => GEN[p.role])).size} ${new Set(g.people.map((p) => GEN[p.role])).size === 1 ? "generation" : "generations"}.`}
      </div>
      <details className="mt-3 rounded-xl border-2 border-foreground/25 p-3" open>
        <summary className="cursor-pointer text-sm font-bold">The family in words</summary>
        <ul className="mt-2 space-y-1 text-sm">
          {[0, 1, 2, 3].map((gen) => g.people.filter((p) => GEN[p.role] === gen).map((p) => (
            <li key={p.id}>
              <button type="button" className="min-h-8 text-left underline-offset-2 hover:underline" onClick={() => setSel(p.id)}>
                <span className="font-semibold">{nameOf(p, g.people)}</span>
                {p.age ? `, ${p.age}` : ""}, {p.sex === "m" ? "male" : p.sex === "f" ? "female" : "sex not known"}
                {p.cond ? `, has ${cond}` : ""}{p.dead && !p.age.startsWith("died") ? ", has died" : ""}{p.note ? ` (${p.note})` : ""}
              </button>
            </li>
          )))}
          {g.div.parents ? <li>Your parents are divorced.</li> : null}
          {g.div.pg ? <li>Your father&apos;s parents are divorced.</li> : null}
          {g.div.mg ? <li>Your mother&apos;s parents are divorced.</li> : null}
          {g.div.partner ? <li>You and your partner are divorced.</li> : null}
        </ul>
      </details>
    </SceneCard>
  );
}

function Symbol({ p, cx, cy, sel }: { p: Person; cx: number; cy: number; sel: boolean }) {
  const k = `${p.id}-${p.sex}-${p.cond ? 1 : 0}`;
  const shape = (r: number, key: string, o: { fill?: string; sw?: number }) =>
    p.sex === "m" ? <Rect k={key} x={cx - r} y={cy - r} w={r * 2} h={r * 2} sw={o.sw ?? 2} fill={o.fill} fillStyle={o.fill === C.ink ? "hachure" : "solid"} gap={3.5} />
      : p.sex === "f" ? <E k={key} cx={cx} cy={cy} w={r * 2} h={r * 2} sw={o.sw ?? 2} fill={o.fill} fillStyle={o.fill === C.ink ? "hachure" : "solid"} gap={3.5} />
      : <Pg k={key} pts={[[cx, cy - r * 1.3], [cx + r * 1.3, cy], [cx, cy + r * 1.3], [cx - r * 1.3, cy]]} sw={o.sw ?? 2} fill={o.fill} fillStyle={o.fill === C.ink ? "hachure" : "solid"} gap={3.5} />;
  return (
    <g>
      {sel ? <Rect k={`gg-sel-${p.id}`} x={cx - R - 7} y={cy - R - 7} w={(R + 7) * 2} h={(R + 7) * 2} fill={C.lime} fillStyle="solid" stroke={C.ink} sw={1.4} dash="3 3" /> : null}
      {p.role === "index" ? shape(R + 4, `gg-idx-${k}`, { sw: 1.8 }) : null}
      {!p.cond ? shape(R, `gg-bg-${k}`, { fill: C.paper, sw: 0.01 }) : null}
      {shape(R, `gg-${k}`, { fill: p.cond ? C.ink : undefined })}
      {p.dead ? <P k={`gg-dead-${p.id}`} d={`M${cx - R - 3} ${cy - R - 3} L ${cx + R + 3} ${cy + R + 3} M${cx + R + 3} ${cy - R - 3} L ${cx - R - 3} ${cy + R + 3}`} stroke={p.cond ? C.red : C.ink} sw={2.4} single /> : null}
      {p.role === "index" ? <Arrow k={`gg-arrow-${p.id}`} from={[cx - 34, cy + 24]} to={[cx - R - 6, cy + R - 2]} sw={2} /> : null}
    </g>
  );
}

function couple(g: Geno, a: Role, b: Role) {
  const pa = g.people.find((p) => p.role === a), pb = g.people.find((p) => p.role === b);
  return pa && pb ? [pa, pb] as const : null;
}

function Lines({ g, x }: { g: Geno; x: Pos }) {
  const out: React.ReactNode[] = [];
  const drawCouple = (a: Role, b: Role, div: boolean, kids: Person[], key: string) => {
    const c = couple(g, a, b);
    if (!c) return;
    const y = ROW[GEN[a]];
    const [xa, xb] = [x[c[0].id], x[c[1].id]].sort((m, n) => m - n);
    const ly = y;
    out.push(<P key={`${key}-u`} k={`gg-${key}-u-${xa}-${xb}`} d={`M${xa + R} ${ly} H ${xb - R}`} sw={2} single rough={0.6} />);
    const mid = (xa + xb) / 2;
    if (div) out.push(<P key={`${key}-d`} k={`gg-${key}-d`} d={`M${mid - 6} ${ly + 7} L ${mid - 1} ${ly - 7} M${mid + 1} ${ly + 7} L ${mid + 6} ${ly - 7}`} sw={2} single />);
    if (kids.length) {
      const cy = ROW[GEN[kids[0].role]];
      const bar = cy - R - 12;
      const ks = kids.map((k) => x[k.id]);
      const lo = Math.min(mid, ...ks), hi = Math.max(mid, ...ks);
      out.push(<P key={`${key}-c`} k={`gg-${key}-c-${ks.join("-")}`} d={`M${mid} ${ly} V ${bar} M${lo} ${bar} H ${hi} ${ks.map((k) => `M${k} ${bar} V ${cy - R}`).join(" ")}`} sw={2} single rough={0.6} />);
    }
  };
  const by = (r: Role) => g.people.filter((p) => p.role === r);
  drawCouple("pgf", "pgm", g.div.pg, [...by("paunt"), ...by("father")], "pg");
  drawCouple("mgf", "mgm", g.div.mg, [...by("mother"), ...by("maunt")], "mg");
  drawCouple("father", "mother", g.div.parents, [...by("older"), ...by("index"), ...by("younger")], "par");
  drawCouple("index", "partner", g.div.partner, by("child"), "me");
  return <g>{out}</g>;
}

/** After the sweep: highlighted lines from each affected blood relative to the patient. */
function TracePaths({ g, x, aff, reduce }: { g: Geno; x: Pos; aff: Person[]; reduce: boolean }) {
  const pt = (r: Role) => {
    const p = g.people.find((q) => q.role === r);
    return p ? [x[p.id], ROW[GEN[r]]] as const : null;
  };
  return (
    <g>
      {aff.filter((p) => p.role !== "index" && p.role !== "partner").map((p, k) => {
        const chain = bloodPath(p).map((r, i) => (i === 0 ? [x[p.id], ROW[GEN[r]]] as const : pt(r))).filter(Boolean) as (readonly [number, number])[];
        if (chain.length < 2) return null;
        const d = chain.map(([cx, cy], i) => `${i ? "L" : "M"}${cx} ${cy}`).join(" ");
        return <path key={p.id} d={d} pathLength={1} strokeDasharray="1 1" className="pointer-events-none" fill="none" stroke={C.red} strokeWidth={4} strokeLinecap="round" style={{ opacity: 0.55, strokeDashoffset: reduce ? 0 : undefined, animation: reduce ? undefined : `gg-draw 900ms ${k * 250}ms ease-out both` }} />;
      })}
    </g>
  );
}
