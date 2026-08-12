/**
 * The fixture patient engine — the no-key, deterministic stand-in for the
 * Director/Actor pair.
 *
 * WHY THIS EXISTS
 * --------------
 * Live mode: Director (decides, JSON) -> hard rules (code) -> Actor (writes).
 * Fixture mode: ONE deterministic function plays both roles. It must still
 * be a *patient*, not a chatbot: replies come from the case's own authored
 * `few_shot` lines and the move library's register-matched fallbacks, never
 * from a shared canned bank. Two sessions of the same case with different
 * seeds must sound like different versions of the same person; two sessions
 * of different cases must never sound alike.
 *
 * It takes the same inputs as runPatientTurn and returns the same shape, so
 * the engine route is identical in both modes. Deterministic per
 * (caseId, seed fingerprint, turn_count, student turn) — a branch off the
 * same turn replays identically until the student says something different.
 */

import type { DepthCase, PatientMoveId, PatientState } from "./types";
import type { DirectorDecision } from "./director";
import { fallbackRendering } from "./moves";
import type { FactRule } from "./engine";

const STARTER_SUBJECTS: Array<readonly [RegExp, string]> = [
  [/^hi\b|^hello\b|^hey\b|^namaste\b/i, "greeting"],
  [/who are you|what do you do/i, "identity_question"],
  [/how are you|how.*feeling|kaise|how.*doing/i, "checkin"],
  [/why.*here|why.*came|reason|brought/i, "reason_for_visit"],
  [/drink|alcohol|liquor|pegging|bottle/i, "drinking"],
  [/wife|husband|marri|family|home|kids|children/i, "family"],
  [/sleep|insomnia|night|bed/i, "sleep"],
  [/work|shop|job|office|business|income|money|debt|loan/i, "work"],
  [/pain|body|head|stomach|chest|heart|gas|weak|hand|leg/i, "somatic"],
  [/scared|afraid|anxious|panic|gabbra|restless|worried/i, "anxiety"],
  [/sad|depress|low|hopeless|cry|tears|worthless/i, "mood"],
  [/die|kill|suicid|end|harm|no point/i, "risk"],
];

/** Deterministic hash of a human string — stable within a session. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pick deterministically, mixing a key into the hash so different seeds choose differently. */
function pick<T>(arr: readonly T[], variantSeed: string, salt: number): T {
  return arr[hashString(`${variantSeed}#${salt}`) % arr.length];
}

/**
 * Session-unique HUMIDITY (0-255): derived from case + session seed, so two
 * sessions of the same case with different seeds draw different few-shot
 * lines and soften differently — 10 runs, 10 distinct openings. The same
 * seed always replays identically (the rewind contract).
 */
function humidityFor(caseId: string, variantSeed: string): number {
  return hashString(`${caseId}#${variantSeed}`) & 0xff;
}

function clamp10(v: number): number {
  return Math.max(0, Math.min(10, Math.round(v * 10) / 10));
}

function moveFromFact(fact: string, case_: DepthCase): string {
  const rule = (case_.disclosure_rules ?? []).find((r) => r.fact === fact);
  return rule?.disclose_via ?? "partial_disclose";
}

const LOW_EFFORT = /^(hi|hello|hey|yo|namaste|ok|okay|fine|hmm|mhm|hm|no|yes|yeah|right|huh|why)\b[!?.]*$/i;

function classifyStudent(
  text: string,
  state: PatientState,
): { move: DirectorDecision["student_move"]; quality: DirectorDecision["quality"]; pressure: boolean } {
  const t = ` ${text.trim()} `;
  const quality = { leading: false, double_barrelled: false, jargon: false };
  // Repeated low-effort inputs are pressure: a real patient's irritation rises
  // when the interviewer keeps nudging with nothing to say.
  const pressure = LOW_EFFORT.test(text.trim()) && state.student_abrupt_streak >= 1;
  if (/don'?t worry|you'?ll be fine|it'?s nothing|just relax|think positive|chill/i.test(t)) return { move: "premature_advice", quality, pressure };
  if (/^[^?]{0,30}[.?]$/.test(t)) return { move: "closed_question", quality, pressure };
  if (/why|how|what|tell me|describe|walk me/i.test(t)) return { move: "open_question", quality, pressure };
  if (/you said|you mentioned|so you|sounds like/i.test(t)) return { move: "reflection", quality, pressure };
  return { move: "open_question", quality, pressure };
}

/**
 * The whole turn in one deterministic call. Mirrors runPatientTurn's contract
 * so the route treats it identically: reply + mutated state + decision.
 */
export function runFixtureTurn(
  case_: DepthCase,
  stateIn: PatientState,
  studentTurn: string,
  facts: FactRule[],
  recentTurns: Array<{ role: "student" | "patient"; content: string }> = [],
): { reply: string; state: PatientState; decision: DirectorDecision } {
  const s: PatientState = { ...stateIn, turn_count: stateIn.turn_count + 1 };
  const { move, quality, pressure } = classifyStudent(studentTurn, s);

  // DANGLING-THREAD RULE (Bug 2): if the patient's last line trailed off
  // (ended with "…", "—", "we…", "it's just…") and the student now asks
  // directly about THAT topic, the patient must NOT deflect — picking up a
  // thread the patient left dangling is an EARNED disclosure. Only a
  // genuinely justified state (irritation or guardedness high) may deflect.
  const lastPatientLine = [...recentTurns].reverse().find((t) => t.role === "patient")?.content ?? "";
  const trailedOff = /(\.\.\.|—|…)\s*$/.test(lastPatientLine.trim()) || /\b(we|it|they|he|she)\.\.\.\s*$/.test(lastPatientLine.trim());
  const threadPicked = trailedOff && studentTurn.trim().length > 15;
  const earnedDisclosure = threadPicked && s.irritation < 7 && s.guardedness < 8;

  // --- state transitions (a mutation of the Director's would-be output) ---
  const deltas = { trust: 0, guardedness: 0, irritation: 0, fatigue: 0 };
  if (move === "reflection" || move === "validation") deltas.trust = 0.5;
  if (move === "open_question") deltas.trust = 0.3;
  if (move === "premature_advice") deltas.irritation = 1.5;
  if (pressure) deltas.irritation += 0.6; // "hey" → "why" → "hey" wears thin
  s.trust = clamp10(s.trust + deltas.trust);
  s.irritation = clamp10(s.irritation + deltas.irritation);
  s.guardedness = clamp10(s.guardedness + deltas.guardedness);
  s.fatigue = clamp10(s.fatigue + deltas.fatigue + 0.2);

  // --- premature advice streak -> permanent hollow compliance (code) ---
  if (move === "premature_advice") {
    s.premature_advice_streak += 1;
    if (s.premature_advice_streak >= 3) s.hollow_compliance_engaged = true;
  } else if (move !== "silence") {
    s.premature_advice_streak = 0;
  }
  // Abruptness streak — code-enforced pressure signal. "why" alone after a
  // bare "hey" is pressure, not curiosity (the spec's exact repro).
  if (LOW_EFFORT.test(studentTurn.trim())) {
    s.student_abrupt_streak += 1;
  } else {
    s.student_abrupt_streak = 0;
  }
  if (s.hollow_compliance_engaged) {
    s.irritation = clamp10(s.irritation - 6); // "yes, sure" instead of push-back
  }

  // --- permitted facts (code gate evaluation, same as live mode) ---
  const ctx = { move, text: studentTurn, topics: [], quality };
  void ctx;
  const permitted = facts.filter((f) => {
    const gateMet = (() => {
      switch (f.gate.kind) {
        case "trust_at_least": return s.trust >= f.gate.value;
        case "turn_after": return s.turn_count >= f.gate.n;
        case "topic_opened": return f.gate.topic === "any" || studentTurn.toLowerCase().includes(f.gate.topic.toLowerCase());
        case "explicit_phrase": return f.gate.patterns.some((p) => p.test(studentTurn));
        default: return false;
      }
    })();
    return !s.disclosed.includes(f.fact_id) && !(f.sensitive && s.trust < 3) && gateMet;
  });

  // --- effects only after the 3rd turn, so openings stay stable ---
  const effects: string[] = [];
  for (const f of permitted) {
    effects.push(`${f.fact_id}:${moveFromFact(f.fact_id, case_)}`);
    s.disclosed = [...s.disclosed, f.fact_id];
  }

  // --- humidity: a fixed random factor per session changes which lines fall out ---
  // The full variant (every seeded field) feeds the hash, so two sessions of
  // the same case with different seeds diverge even when one or two fields
  // collide: 10 seeds ⇒ 10 distinct openings, always in this patient's voice.
  const humidity = humidityFor(
    case_.case_id,
    s.variant.mood_today + s.variant.recent_event + s.variant.opening_posture +
      s.variant.somatic_focus + s.variant.language_mix + s.variant.most_defended_topic,
  );

  // --- pick a patient move: hollow compliance wins; else an authored effect; else a stance ---
  let patientMove: PatientMoveId;
  if (s.hollow_compliance_engaged) {
    patientMove = "hollow_compliance";
  } else if (earnedDisclosure) {
    // The student picked up the thread the patient left dangling — this is
    // an EARNED disclosure, never a deflection.
    patientMove = "partial_disclose";
  } else if (effects.length > 0 && (s.turn_count > 3 || move === "risk_probe" || /die|kill|suicid/i.test(studentTurn))) {
    const eff = effects[(s.turn_count + humidity) % effects.length] as string;
    patientMove = eff.slice(eff.indexOf(":") + 1) as PatientMoveId;
  } else {
    const views: Record<string, PatientMoveId[]> = {
      full_disclose: ["minimise", "reluctant_disclose", "full_disclose"],
      resistant: ["irritated_push_back", "deflect_to_other_person", "one_word"],
      guarded: ["reluctant_disclose", "minimise", "question_back"],
      cooperative: ["partial_disclose", "full_disclose", "minimise"],
    };
    const stance = s.phase === "opening" && s.trust < 3 ? String(case_.difficulty) : "cooperative";
    const pool = views[stance] ?? views.cooperative;
    patientMove = pool[(s.turn_count + humidity) % pool.length];
  }

  // no move twice within the last 3 turns (anti-repetition, code):
  if (s.last_moves.slice(-3).includes(patientMove)) {
    const used = new Set(s.last_moves.slice(-3));
    const alts: PatientMoveId[] = ["partial_disclose", "reluctant_disclose", "minimise", "deflect_to_somatic", "question_back"];
    for (const a of alts) if (!used.has(a)) { patientMove = a; break; }
  }
  s.last_moves = [...s.last_moves.slice(-6), patientMove];

  // --- the line: authored few_shot first, then register-matched fallback ---
  let reply = "";
  const register = case_.identity?.language_register ?? "plain English";
  const fewShot = (case_.few_shot ?? []) as Array<{ patient?: string } | string>;
  const fewShotLines = fewShot
    .map((f) => (typeof f === "string" ? f : f.patient ?? ""))
    .filter((l) => l && l.trim().length > 1);
  if (fewShotLines.length > 0 && s.turn_count === 1) {
    // The student's very first message is usually a greeting — no patient
    // answers "hey" with their deepest line. The exact authored line picked
    // is humidity-dependent, so 10 sessions of the same case open
    // differently while always staying inside this patient's voice.
    // few_shot is used ONCE (the opening); from the second patient turn
    // fixture_lines carry the session. Repeating the same few_shot line
    // would trip the anti-repetition guard into the generic bank.
    const idx = humidity % fewShotLines.length;
    const line = fewShotLines[idx];
    if (line && line !== "") {
      reply = line;
    }
  } else if (fewShotLines.length > 0) {
    // A rehearsed moment: if the student's turn topically matches a few-shot
    // exchange's student line, the patient gives the authored response.
    // (Requires a real student line — an exchange without one never matches.)
    const tWords = new Set(studentTurn.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
    if (tWords.size > 0) {
      const pairs = (case_.few_shot ?? []) as Array<{ student?: string; patient?: string }>;
      for (const pair of pairs) {
        if (!pair?.student || pair.student.trim().length < 10) continue;
        const sw = new Set(pair.student.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
        if (sw.size === 0) continue;
        let hits = 0;
        for (const w of sw) if (tWords.has(w)) hits++;
        if (hits >= Math.min(2, sw.size)) {
          reply = pair.patient ?? "";
          break;
        }
      }
    }
  }
  const said = s.last_patient_utterances;
  if (!reply) {
    // Authored per-case lines ALWAYS win in fixture mode, for every move:
    // this patient's voice is the case, never the shared move bank. Only
    // cases with NO authored voice degrade to the generic library lines.
    const authored = (case_.fixture_lines ?? []) as string[];
    if (authored.length > 0) {
      const idx = (s.turn_count + humidity) % authored.length;
      reply = authored[idx];
      // Authentic reaction to pressure: authored lines are the voice, but
      // real people shut down when the interviewer stops trying.
      if (pressure && s.irritation >= 4) {
        const short = fallbackRendering("one_word", register, s.turn_count + humidity);
        if (short) reply = short;
      }
    } else if (s.turn_count <= 2 && patientMove !== "irritated_push_back") {
      // In the first two turns even a disclosure is softened: patients don't
      // open their deepest line to a stranger's "hi".
      const soft = fallbackRendering("reluctant_disclose", register, s.turn_count + humidity);
      if (soft) reply = soft;
    }
    if (!reply) {
      const candidate = fallbackRendering(patientMove, register, s.turn_count + humidity);
      reply = candidate ?? "";
    }
  }
  if (!reply) reply = pick(["Mmm.", "I don't know.", "…"], register, s.turn_count + humidity);

  // discourse-level repetition guard: cosine-style token similarity > 0.85 -> regenerate
  const prev8 = said.slice(-8);
  const tooClose = prev8.some((u) => {
    const a = new Set((reply ?? "").toLowerCase().split(/\W+/).filter(Boolean));
    const b = new Set(u.toLowerCase().split(/\W+/).filter(Boolean));
    if (!a.size || !b.size) return false;
    let overlap = 0;
    for (const tok of a) if (b.has(tok)) overlap++;
    return overlap / Math.min(a.size, b.size) > 0.85;
  });
if (tooClose) {
    // Re-pick from THIS patient's authored lines first — the shared bank is
    // the last resort, never the first. Skip lines too close to the last 8.
    const authored = (case_.fixture_lines ?? []) as string[];
    let replacement = "";
    if (authored.length > 0) {
      for (let i = 0; i < authored.length; i++) {
        const idx = (s.turn_count + humidity + i) % authored.length;
        const candidate = authored[idx];
        const close = said.slice(-8).some((u) => {
          const a = new Set(candidate.toLowerCase().split(/\W+/).filter(Boolean));
          const b = new Set(u.toLowerCase().split(/\W+/).filter(Boolean));
          if (!a.size || !b.size) return false;
          let ov = 0;
          for (const t of a) if (b.has(t)) ov++;
          return ov / Math.min(a.size, b.size) > 0.85;
        });
        if (!close) { replacement = candidate; break; }
      }
    }
    if (replacement) {
      reply = replacement;
    } else {
      const alts2 = ["one_word", "silence", "tangent", "humour_as_shield"].filter((m) => !s.last_moves.slice(-3).includes(m));
      const alt = alts2[(s.turn_count + humidity) % alts2.length] ?? "one_word";
      reply = fallbackRendering(alt as PatientMoveId, register, s.turn_count + humidity) ?? "…";
      patientMove = alt as PatientMoveId;
    }
  }
  s.last_patient_utterances = [...said.slice(-7), reply];

  // --- fielded topic detection (state only, keeps the Actor honest in live mode too) ---
  for (const [re, topic] of STARTER_SUBJECTS) {
    if (re.test(studentTurn) && !s.topics_touched.includes(topic)) s.topics_touched.push(topic);
  }

  const decision: DirectorDecision = {
    student_move: move,
    quality,
    gates_now_met: effects.map((e) => e.split(":")[0]),
    state_delta: deltas,
    patient_move: patientMove,
    disclose: effects.map((e) => e.split(":")[0]),
    affect: s.hollow_compliance_engaged ? "flat" : s.irritation > 6 ? "irritated" : "flat_with_effort",
    length_hint: s.fatigue > 7 ? "one_word" : s.irritation > 6 ? "short" : "medium",
    must_not_mention: facts.map((f) => f.fact_id).filter((id) => !permitted.some((p) => p.fact_id === id)),
  };

  return { reply, state: s, decision };
}