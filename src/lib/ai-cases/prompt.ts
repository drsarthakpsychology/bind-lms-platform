/**
 * The generator prompt. Built only from the criteria list and the request
 * (no student data), so it runs on the content_generation lane.
 */
import { CRITERIA_BY_DX, DX_NAMES, RULES, rulesFor } from "./criteria";
import type { AiCaseInput } from "./types";

const DIFFICULTY: Record<1 | 2 | 3, string> = {
  1: "Easy: a typical picture. The key features appear by clue 3 or 4.",
  2: "Medium: one look-alike stays plausible until clue 5.",
  3: "Hard: an atypical or mixed picture; the deciding fact comes in clue 6 or an investigation.",
};

const SETTING: Record<"indian" | "global", string> = {
  indian:
    "India. Use an Indian town or city in \"place\" (e.g. \"Indore · district hospital OPD\"). Realistic Indian names, family set-up and help-seeking (a GP or faith healer first, family in the room). An occasional Hindi or regional word is fine, with its meaning clear from context.",
  global:
    "Outside India (e.g. UK, US, Kenya, Brazil, Japan, Australia). Use a non-Indian town or city in \"place\" (e.g. \"Leeds · GP surgery\"). Realistic local names and services.",
};

export function buildGeneratorPrompt(input: AiCaseInput, problems: string[] = []): { system: string; user: string } {
  const c = CRITERIA_BY_DX[input.dx];
  const checklist = rulesFor(c)
    .map((r) => `- ${r.id}: ${r.label} (wording like ${r.hint})`)
    .join("\n");
  const needs = [
    c.core?.length ? `At least one of: ${c.core.join(", ")}.` : "",
    c.all.length ? `All of: ${c.all.join(", ")}.` : "",
    c.minOf ? `At least ${c.minOf.n} of: ${c.minOf.ids.join(", ")}.` : "",
    c.duration ? `Duration: ${c.duration.label}. Put it in "duration" AND write it in a clue (e.g. "for six weeks").` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const lookAlikes = c.lookAlikes
    .map((l) =>
      l.rule === "@duration"
        ? `- ${l.dx} (${DX_NAMES[l.dx]}): ruled out by the duration.`
        : `- ${l.dx} (${DX_NAMES[l.dx]}): a clue or result must show ${RULES[l.rule].label} (e.g. ${RULES[l.rule].hint}).`,
    )
    .join("\n");

  const system = `You write short teaching vignettes for psychology students in a diagnosis-guessing game. They are fictional and educational. Output valid JSON only, no prose.`;

  const user = `Write ONE new case whose correct DSM-5-TR answer is: ${c.name}.

Setting: ${SETTING[input.setting]}
Difficulty: ${DIFFICULTY[input.difficulty]}

The case MUST show these (each with its own wording, never a bare label):
${needs}
Checklist items:
${checklist}

Look-alikes you MUST list in "differentials", each ruled out by a fact in the text:
${lookAlikes}

Rules:
- Exactly 6 clues, one or two plain sentences each, from vague (clue 1) to telling (clue 6). Spread the features across the clues.
- NEVER write the diagnosis name or its abbreviation in clues, place, pointer or investigation labels/results.
- Investigation labels are neutral ("Mood and affect", "Ask her mother", "A rating scale", "Blood tests"). 3 to 5 of them, kind one of mse, collateral, scale, lab.
- Each differential: {"dx": an id from [${Object.keys(DX_NAMES).filter((k) => k !== c.dx).join(", ")}], "whyNot": the criterion that rules it out, in plain words}.
- "pointer": where to look, without naming the answer.
- "overview": 3 to 5 sentences teaching the key criteria, thresholds and the main look-alike.
- No phone numbers, links or real people.

Return exactly this JSON shape:
{"place": "", "clues": ["", "", "", "", "", ""], "investigations": [{"kind": "mse", "label": "", "result": ""}], "differentials": [{"dx": "", "whyNot": ""}], "pointer": "", "overview": ""${c.duration ? `, "duration": {"value": 0, "unit": "weeks"}` : ""}}${
    problems.length ? `\n\nYour last attempt was rejected by the checker. Fix ALL of these:\n${problems.map((p) => `- ${p}`).join("\n")}` : ""
  }`;
  return { system, user };
}
