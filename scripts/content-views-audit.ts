/**
 * Student / Clinician view audit.
 *
 * Renders both reading views of every content item that sits under the
 * Student / Clinician switch (study sections, summaries, quiz explanations,
 * concepts, medicines) as plain text and counts the items where the two views
 * come out identical. Run: npx tsx scripts/content-views-audit.ts [--list] [--json out.json]
 */
import { writeFileSync } from "node:fs";
import { MODULES } from "@/lib/study";
import { sectionHasViews, singleVoiceSection, viewText } from "@/lib/study/views";
import { NOTES, pick, type Note } from "@/lib/learn/notes";
import { ALL_ITEMS } from "@/lib/learn/content";
import { ALL_CONCEPTS } from "@/lib/learn/concepts";
import { MEDS } from "@/lib/meds";
import { splitSection } from "@/lib/study/chunk";

type Row = { area: string; group: string; id: string; same: boolean };
const rows: Row[] = [];
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

// 1. Study sections (the switch sits on every reading section and the module test).
for (const m of MODULES) {
  for (const s of m.sections) {
    const same = !sectionHasViews(s);
    rows.push({ area: "study-section", group: m.id, id: s.id, same });
    // Same text, but a section with one voice by design (tests, checks, viva, Q&A): the switch is hidden there.
    rows.push({ area: same && singleVoiceSection(s) ? "study-1voice" : "study-reading", group: m.id, id: s.id, same });
    // Parts inside a section (the reader shows one part at a time).
    if (!s.isTest) {
      for (const [k, c] of splitSection(s).chunks.entries()) {
        rows.push({ area: "study-part", group: m.id, id: `${s.id}#${k + 1}`, same: viewText(c.blocks, "student") === viewText(c.blocks, "clinician") });
      }
    }
  }
}

// 2. Summaries (notes): the short summary and every bullet.
const noteText = (n: Note, v: "student" | "clinician") => [pick(n.tldr, v), ...n.sections.flatMap((s) => s.points.map((p) => pick(p, v)))].join("\n");
for (const n of NOTES)
  for (const [k, sec] of n.sections.entries()) rows.push({ area: "note-section", group: n.id, id: `${n.id}#${k + 1} ${sec.title}`, same: sec.points.every((p) => norm(pick(p, "student")) === norm(pick(p, "clinician"))) });
for (const n of NOTES) for (const sec of n.sections) for (const [k, p] of sec.points.entries()) rows.push({ area: "note-bullet", group: n.id, id: `${sec.title}#${k + 1}`, same: norm(pick(p, "student")) === norm(pick(p, "clinician")) });
for (const n of NOTES) rows.push({ area: "note", group: "notes", id: n.id, same: norm(noteText(n, "student")) === norm(noteText(n, "clinician")) });

// 3. Quiz items (lesson player, review, blitz): the explanation after an answer.
for (const i of ALL_ITEMS) rows.push({ area: "quiz-item", group: "lessons", id: i.id, same: norm(i.student) === norm(i.clinician) });

// 4. Concepts (coach, detective answers, practice runner).
for (const c of ALL_CONCEPTS) rows.push({ area: "concept", group: c.domain, id: c.id, same: norm(c.student) === norm(c.clinician) });

// 5. Medicines: the profile and every dose.
for (const md of MEDS) {
  rows.push({ area: "medicine", group: md.group, id: md.id, same: norm(md.student) === norm(md.clinician) });
  for (const d of md.doses) rows.push({ area: "medicine-dose", group: md.id, id: `${md.id}@${d.amount}`, same: norm(d.student) === norm(d.clinician) });
}

const args = process.argv.slice(2);
const areas = [...new Set(rows.map((r) => r.area))];
console.log("area".padEnd(16), "items".padStart(6), "identical".padStart(10));
for (const a of areas) {
  const r = rows.filter((x) => x.area === a);
  console.log(a.padEnd(16), String(r.length).padStart(6), String(r.filter((x) => x.same).length).padStart(10));
}
console.log("\nstudy sections with identical views, by module:");
for (const m of MODULES) {
  const r = rows.filter((x) => x.area === "study-reading" && x.group === m.id);
  const one = rows.filter((x) => x.area === "study-1voice" && x.group === m.id).length;
  const same = r.filter((x) => x.same).length;
  console.log(`  ${String(m.num).padStart(2)} ${m.id.padEnd(22)} reading sections identical ${String(same).padStart(3)} / ${r.length}   one-voice sections (switch hidden) ${one}`);
}
if (args.includes("--list")) for (const r of rows.filter((x) => x.same && (x.area === "study-reading" || x.area === "note-section"))) console.log(`SAME ${r.area} ${r.group} ${r.id}`);
const j = args.indexOf("--json");
if (j >= 0) writeFileSync(args[j + 1], JSON.stringify(rows, null, 1));
