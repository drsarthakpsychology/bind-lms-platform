/**
 * A typed Quick Note to the one view shape both the website and the phone
 * draw (./view-types.ts). Pure: data in, data out.
 */
import { noteById } from "@/lib/learn/notes";
import { SCENARIOS } from "@/lib/learn/scenarios";
import { MEDS } from "@/lib/meds";
import { MODULES } from "@/lib/study";
import { quickNoteById } from "./index";
import { CRITERIA_SOURCE_LINE, FOR_LEARNING_LINE, TOPIC_LABEL, TYPE_LABEL, type QuickNote, type Table } from "./types";
import type { QuickLink, QuickNoteView, QuickSection } from "./view-types";

const e = encodeURIComponent;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function sec(title: string, body: Omit<QuickSection, "id" | "title">): QuickSection | null {
  const has = (body.bullets?.length ?? 0) + (body.steps?.length ?? 0) + (body.table?.rows.length ?? 0) + (body.pairs?.length ?? 0);
  return has ? { id: slug(title), title, ...body } : null;
}
const tableSec = (title: string, table: Table) => sec(title, { table });

function sectionsOf(n: QuickNote): { facts: QuickNoteView["facts"]; sections: (QuickSection | null)[]; alert: QuickNoteView["alert"]; treatment: boolean } {
  switch (n.type) {
    case "criteria": {
      const f = n.facts;
      const facts = [
        f.threshold && { label: "Threshold", value: f.threshold },
        f.duration && { label: "Duration", value: f.duration },
        f.onset && { label: "Onset", value: f.onset },
        f.settings && { label: "Settings", value: f.settings },
        f.impairment && { label: "Impairment", value: f.impairment },
        f.minAge && { label: "Age", value: f.minAge },
      ].filter((x): x is { label: string; value: string } => !!x);
      return {
        facts,
        sections: [
          sec("Core picture", { bullets: n.core }),
          ...(n.groups ?? []).map((g) => sec(g.count ? `${g.name} (${g.count})` : g.name, { bullets: g.examples })),
          sec("Presentations", { pairs: (n.presentations ?? []).map((p) => ({ label: p.name, value: p.when })) }),
          sec("Specifiers", { bullets: n.specifiers }),
          sec("Severity", { bullets: n.severity }),
          sec("Rule out", { bullets: n.exclusions }),
          sec("Look-alikes", { pairs: n.differentials.map((d) => ({ label: d.name, value: d.tell, noteId: d.noteId })) }),
          sec("First-line care", { bullets: n.firstLine }),
          sec("In the Indian clinic", { bullets: n.india }),
        ],
        alert: n.pitfalls?.length ? { title: "Common mistakes", points: n.pitfalls } : null,
        treatment: !!n.firstLine?.length,
      };
    }
    case "summary":
      return {
        facts: [],
        sections: [sec("The picture", { bullets: n.picture }), sec("How it sounds", { bullets: n.howItSounds }), sec("MSE clues", { bullets: n.mseClues }), sec("Rule out first", { bullets: n.ruleOutFirst }), sec("Treatment", { bullets: n.treatment })],
        alert: n.redFlags.length ? { title: "Never skip", points: n.redFlags } : null,
        treatment: n.treatment.length > 0,
      };
    case "differential":
      return {
        facts: [{ label: "Presenting with", value: n.presenting }],
        sections: [
          sec("Ask first", { steps: n.askFirst }),
          sec("Possible diagnoses", { pairs: n.rows.map((r) => ({ label: r.diagnosis, value: `For: ${r.pointsTo}. Against: ${r.pointsAway}.`, noteId: r.noteId })) }),
          sec("In the Indian clinic", { bullets: n.india }),
        ],
        alert: n.dontMiss.length ? { title: "Do not miss", points: n.dontMiss } : null,
        treatment: false,
      };
    case "distinction":
      return {
        facts: [{ label: "Quick tell", value: n.quickTell }],
        sections: [tableSec("Side by side", { head: ["", ...n.items], rows: n.rows.map((r) => [r.feature, ...r.cells]) }), ...(n.extra ?? []).map((x) => sec(x.title, { bullets: x.points }))],
        alert: null,
        treatment: false,
      };
    case "theory":
      return {
        facts: [{ label: "Who", value: n.who }, ...(n.when ? [{ label: "When", value: n.when }] : []), { label: "Core idea", value: n.coreIdea }],
        sections: [...(n.tables ?? []).map((t) => tableSec(t.title, t.table)), sec("Key terms", { pairs: n.keyTerms.map((k) => ({ label: k.term, value: k.means })) }), sec("In the clinic", { bullets: n.inTheClinic }), sec("Limits", { bullets: n.limits })],
        alert: null,
        treatment: false,
      };
    case "therapy":
      return {
        facts: [{ label: "The model", value: n.model }, ...(n.session ? [{ label: "Sessions", value: n.session }] : [])],
        sections: [
          sec("Used for", { bullets: n.usedFor }),
          sec("Steps", { steps: n.steps }),
          sec("Techniques", { pairs: n.techniques.map((t) => ({ label: t.name, value: t.what })) }),
          n.table ? tableSec(n.table.title, n.table.table) : null,
          sec("How it sounds", { bullets: n.soundsLike }),
          sec("In the Indian clinic", { bullets: n.india }),
        ],
        alert: n.notFor?.length ? { title: "Not for", points: n.notFor } : null,
        treatment: true,
      };
    case "pharm":
      return {
        facts: n.facts ?? [],
        sections: [
          ...n.tables.map((t) => tableSec(t.title, t.table)),
          sec("Monitoring", { bullets: n.monitoring }),
          sec("Interactions", { bullets: n.interactions }),
          ...(n.points ?? []).map((p) => sec(p.title, { bullets: p.points })),
        ],
        alert: n.emergencies?.length ? { title: "Emergencies", points: n.emergencies.map((x) => `${x.name}: ${x.signs}. ${x.firstStep}.`) } : null,
        treatment: true,
      };
    case "assessment":
      return {
        facts: [{ label: "Measures", value: n.measures }, ...(n.facts ?? [])],
        sections: [
          ...(n.tables ?? []).map((t) => tableSec(t.title, t.table)),
          ...(n.sections ?? []).map((s) => sec(s.title, s.steps ? { steps: s.points } : { bullets: s.points })),
          sec("Use it when", { bullets: n.useWhen }),
        ],
        alert: n.cautions.length ? { title: "Careful", points: n.cautions } : null,
        treatment: false,
      };
    case "exam":
      return {
        facts: [],
        sections: [sec("Points", { pairs: n.points.map((p) => ({ label: p.fact, value: p.trap ? `Trap: ${p.trap}` : "" })) }), ...(n.mnemonics ?? []).map((m) => sec(m.name, { bullets: m.stands }))],
        alert: null,
        treatment: false,
      };
  }
}

/** Where a Quick Note leads: its module and related notes; its quiz, patient scenarios, games and medicines. */
export function linksOf(n: QuickNote): { deeper: QuickLink[]; practise: QuickLink[] } {
  const from = `from=${e(`/study/notes/${n.id}`)}`;
  const deeper: QuickLink[] = [];
  const practise: QuickLink[] = [];
  const mod = n.links.moduleId ? MODULES.find((m) => m.id === n.links.moduleId) : undefined;
  if (mod) deeper.push({ label: `Lesson: ${mod.title}`, meta: `Module ${mod.num}`, href: `/study/${e(mod.id)}`, target: { screen: "studyModule", moduleId: mod.id, web: `/study/${e(mod.id)}` } });
  const summary = n.links.summaryId ? noteById(n.links.summaryId) : undefined;
  if (summary) deeper.push({ label: `Summary: ${summary.title}`, meta: summary.tagline, href: `/study/notes/${e(summary.id)}`, target: { screen: "studyNote", noteId: summary.id, web: `/study/notes/${e(summary.id)}` } });
  for (const id of n.links.related ?? []) {
    const r = quickNoteById(id);
    if (r) deeper.push({ label: r.title, meta: TYPE_LABEL[r.type], href: `/study/notes/${e(r.id)}`, target: { screen: "studyNote", noteId: r.id, web: `/study/notes/${e(r.id)}` } });
  }
  if (summary) {
    const web = summary.quiz.lessonId ? `/prep/smart/play?lesson=${e(summary.quiz.lessonId)}&${from}` : `/prep/smart/coach?domain=${e(summary.quiz.domain ?? "")}&${from}`;
    practise.push({ label: "Quick quiz on this topic", meta: "Questions that check you know it", href: web, target: { screen: "practice", tool: "prep", web } });
    if (SCENARIOS.some((s) => s.noteId === summary.id)) {
      const w = `/practice/scenarios?note=${e(summary.id)}&${from}`;
      practise.push({ label: "Practise with a patient", meta: "Choose what you would say and do", href: w, target: { screen: "practice", tool: "scenarios", web: w } });
    }
  }
  for (const p of n.links.practice ?? []) {
    if (p === "detective") practise.push({ label: "Diagnosis detective", meta: "Find the diagnosis from the clues", href: "/practice/detective", target: { screen: "practice", tool: "detective", web: "/practice/detective" } });
    if (p === "mse") practise.push({ label: "MSE trainer", meta: "Describe a patient in the right words", href: "/practice/mse", target: { screen: "practice", tool: "mse", web: "/practice/mse" } });
    if (p === "terms") practise.push({ label: "Say it clinically", meta: "Everyday words to clinical terms", href: "/practice/terms", target: { screen: "practice", tool: "terms", web: "/practice/terms" } });
  }
  for (const id of n.links.medicines ?? []) {
    const m = MEDS.find((x) => x.id === id);
    if (m) practise.push({ label: `Medicine: ${m.name}`, meta: m.cls, href: `/practice/medicines/${e(m.id)}`, target: { screen: "unknown", web: `/practice/medicines/${e(m.id)}` } });
  }
  return { deeper, practise };
}

export function quickNoteView(n: QuickNote): QuickNoteView {
  const s = sectionsOf(n);
  const { deeper, practise } = linksOf(n);
  return {
    id: n.id,
    type: n.type,
    typeLabel: TYPE_LABEL[n.type],
    title: n.title,
    aka: n.aka ?? [],
    oneLine: n.oneLine,
    topic: n.topic,
    topicLabel: TOPIC_LABEL[n.topic],
    facts: s.facts,
    sections: s.sections.filter((x): x is QuickSection => !!x),
    alert: s.alert,
    deeper,
    practise,
    sourceLine: n.type === "criteria" ? CRITERIA_SOURCE_LINE : null,
    careLine: s.treatment ? FOR_LEARNING_LINE : null,
  };
}

/** Every string a student can read in a note: the search index and the tests use it. */
export function quickNoteText(v: QuickNoteView): string[] {
  const out: string[] = [v.title, ...v.aka, v.oneLine];
  for (const f of v.facts) out.push(f.label, f.value);
  for (const s of v.sections) {
    out.push(s.title, ...(s.bullets ?? []), ...(s.steps ?? []));
    if (s.table) out.push(...s.table.head, ...s.table.rows.flat());
    for (const p of s.pairs ?? []) out.push(p.label, p.value);
  }
  if (v.alert) out.push(v.alert.title, ...v.alert.points);
  return out.filter(Boolean);
}
