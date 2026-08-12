#!/usr/bin/env tsx
/**
 * Seed the rights_registry with the full Casebook acquisition list.
 *
 *   npm run seed-rights
 *
 * Status decisions (per Kavya's instruction "I've paid for all, have all the
 * permission"):
 *   - FREE sources → public_domain / open_access (ingest immediately)
 *   - BUY + LICENCE titles → licensed (Kavya's assertion; the registry
 *     records it and the ingester can pick them up)
 *
 * The licence gate stays enforced in code regardless: only rows marked
 * public_domain | open_access | licensed are ingestible; everything else is
 * invisible to the ingester and can never reach a student surface.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
  }
  return { ...process.env, ...out } as Record<string, string>;
}

interface RegistrySeed {
  title: string;
  authors?: string[];
  publisher?: string;
  category: string;
  layer: "clinical" | "phenomenological" | "style" | "cultural" | "reasoning";
  priority: number;
  rights_status: "public_domain" | "open_access" | "licensed";
  unlocks: string;
}

const FREE = "public_domain";
const OA = "open_access";

const SEEDS: RegistrySeed[] = [
  // ---- Part 1 — Clinical core ----
  { title: "Psychiatric Interviewing: The Art of Understanding", authors: ["Shea"], category: "interviewing", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "suicide-assessment OSCE station (CASE Approach), interviewing rubric" },
  { title: "Clinical Interviewing", authors: ["Sommers-Flanagan"], category: "interviewing", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "interviewing scaffolds, debrief standards" },
  { title: "The First Interview", authors: ["Morrison"], category: "interviewing", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "intake structure" },
  { title: "DSM-5-TR Made Easy", authors: ["Morrison"], category: "interviewing", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "criteria in plain language" },
  { title: "The Clinical Interview Using DSM-5", authors: ["Othmer"], category: "interviewing", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "structured diagnostic interviewing" },
  { title: "Motivational Interviewing", authors: ["Miller", "Rollnick"], category: "interviewing", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "non-adherence + ambivalence OSCE stations" },
  { title: "Sims' Symptoms in the Mind", authors: ["Oyebode"], category: "psychopathology", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "authoritative confusable-pair distinctions, MSE spine" },
  { title: "Fish's Clinical Psychopathology", authors: ["Casey", "Kelly"], category: "psychopathology", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "form vs content precision" },
  { title: "The Psychiatric Mental Status Examination", authors: ["Trzepacz", "Baker"], category: "psychopathology", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "MSE domain standards" },
  { title: "General Psychopathology", authors: ["Jaspers"], category: "psychopathology", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "phenomenological precision" },
  { title: "The Divided Self", authors: ["Laing"], category: "psychopathology", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "phenomenological texture" },
  { title: "Formulation in Psychology and Psychotherapy", authors: ["Johnstone", "Dallos"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "published expert formulations for Forge stage 3" },
  { title: "Collaborative Case Conceptualization", authors: ["Kuyken", "Padesky", "Dudley"], category: "formulation", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "model formulations" },
  { title: "Case Formulation Approach to CBT", authors: ["Persons"], category: "formulation", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "model formulations" },
  { title: "Handbook of Psychotherapy Case Formulation", authors: ["Eells"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "formulation comparison targets" },
  { title: "ICD-11 CDDR (WHO API)", category: "guideline", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "diagnostic requirements, SCT grounding" },
  { title: "WHO mhGAP Intervention Guide", category: "guideline", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "referral thresholds, non-specialist framing" },
  { title: "NICE guidelines (mental health)", category: "guideline", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "standard-of-care answers" },
  { title: "NIMHANS clinical practice guidelines", category: "guideline", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "Indian standard-of-care" },
  { title: "Indian Psychiatric Society CPGs", category: "guideline", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "Indian standard-of-care" },
  { title: "Cognitive Behavior Therapy: Basics and Beyond", authors: ["Beck"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "CBT framing" },
  { title: "DBT Skills Training Manual", authors: ["Linehan"], category: "formulation", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "skills scaffolding" },
  { title: "Acceptance and Commitment Therapy", authors: ["Hayes"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "ACT framing" },
  { title: "On Becoming a Person", authors: ["Rogers"], category: "interviewing", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "therapeutic stance" },
  { title: "Families and Family Therapy", authors: ["Minuchin"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "family systems" },
  { title: "Attachment and Loss (3 vols)", authors: ["Bowlby"], category: "formulation", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "predisposing factors" },

  // ---- Part 2 — India (highest priority) ----
  { title: "A Short Textbook of Psychiatry", authors: ["Ahuja"], publisher: "Jaypee", category: "india", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "Indian psychiatric ground truth" },
  { title: "Textbook of Postgraduate Psychiatry", authors: ["Vyas", "Ahuja"], publisher: "Jaypee", category: "india", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "Indian postgraduate standards" },
  { title: "Workbook of Case Vignettes in Psychiatry", authors: ["Bhugra", "Malhotra"], category: "india", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "authored case vignettes" },
  { title: "Indian Journal of Psychiatry (full archive)", category: "india", layer: "clinical", priority: 1, rights_status: OA, unlocks: "Indian case archive, Dhat literature" },
  { title: "National Mental Health Survey of India", category: "india", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "help-seeking delay distributions" },
  { title: "Mental Healthcare Act 2017, full text", category: "india", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "ethics sections cited" },
  { title: "RCI scope of practice documents", category: "india", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "scope boundaries" },
  { title: "POCSO Act", category: "india", layer: "clinical", priority: 1, rights_status: FREE, unlocks: "mandated-reporting sections" },
  { title: "Sathyanarayana Rao on Dhat syndrome", category: "india", layer: "clinical", priority: 1, rights_status: OA, unlocks: "authoritative Dhat readings" },
  { title: "Culture and Mental Health", authors: ["Bhugra"], category: "india", layer: "cultural", priority: 1, rights_status: "licensed", unlocks: "CULT attributional models" },
  { title: "Tagore, complete works in translation", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "family duty patterns" },
  { title: "Premchand — Godaan, Nirmala", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "rural family patterns" },
  { title: "Bhagavad Gita (Arnold/Besant/Telang translations)", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "karma/dharma explanatory models" },
  { title: "Upanishads (Max Müller)", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "meaning-making frameworks" },
  { title: "Patanjali's Yoga Sutras", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "mind-body explanatory models" },
  { title: "Dhammapada", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "suffering frameworks" },
  { title: "Ramayana, Mahabharata (Ganguli)", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "dharma-conflict models" },
  { title: "Guru Granth Sahib (English)", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "Punjabi explanatory models" },
  { title: "Ashtanga Hridayam / Charaka Samhita", category: "india", layer: "cultural", priority: 1, rights_status: FREE, unlocks: "dosha explanatory models" },

  // ---- Part 3 — Culture & anomalous experience ----
  { title: "DSM-5-TR Handbook on the Cultural Formulation Interview", authors: ["APA"], category: "culture", layer: "cultural", priority: 1, rights_status: "licensed", unlocks: "CFI mode grounding" },
  { title: "Patients and Healers in the Context of Culture", authors: ["Kleinman"], category: "culture", layer: "cultural", priority: 2, rights_status: "licensed", unlocks: "explanatory-model library" },
  { title: "The Illness Narratives", authors: ["Kleinman"], category: "culture", layer: "phenomenological", priority: 2, rights_status: "licensed", unlocks: "illness-experience descriptions" },
  { title: "Medusa's Hair", authors: ["Obeyesekere"], category: "culture", layer: "cultural", priority: 2, rights_status: "licensed", unlocks: "possession phenomenology" },
  { title: "When God Talks Back", authors: ["Luhrmann"], category: "culture", layer: "cultural", priority: 2, rights_status: "licensed", unlocks: "religious experience framing" },
  { title: "Varieties of Anomalous Experience", authors: ["Cardeña"], category: "anomalous", layer: "clinical", priority: 1, rights_status: "licensed", unlocks: "clinical vs non-clinical anomalous experience" },
  { title: "Crazy Like Us", authors: ["Watters"], category: "culture", layer: "cultural", priority: 2, rights_status: "licensed", unlocks: "globalisation critique frame" },
  { title: "Idioms of distress literature — Nichter et al.", category: "culture", layer: "cultural", priority: 1, rights_status: OA, unlocks: "idiom bank grounding" },
  { title: "Hearing Voices Movement literature", category: "anomalous", layer: "phenomenological", priority: 2, rights_status: OA, unlocks: "voice-experience framing" },
  { title: "Moreira-Almeida on spiritual vs psychotic experience", category: "anomalous", layer: "clinical", priority: 2, rights_status: OA, unlocks: "discriminator for possession/distress" },
  { title: "Madness and Civilization", authors: ["Foucault"], category: "culture", layer: "cultural", priority: 3, rights_status: "licensed", unlocks: "institutional critique frame" },

  // ---- Part 4 — Sleep ----
  { title: "Principles and Practice of Sleep Medicine", authors: ["Kryger"], category: "sleep", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "sleep rare-case differentials" },
  { title: "ICSD-3-TR (AASM)", category: "sleep", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "sleep disorder criteria" },
  { title: "Why We Sleep", authors: ["Walker"], category: "sleep", layer: "clinical", priority: 3, rights_status: "licensed", unlocks: "sleep science public framing" },
  { title: "Hallucinations", authors: ["Sacks"], category: "sleep", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "hallucination phenomenology" },

  // ---- Part 5 — Trauma, addiction, personality ----
  { title: "The Body Keeps the Score", authors: ["van der Kolk"], category: "trauma", layer: "clinical", priority: 3, rights_status: "licensed", unlocks: "trauma rubric grounding" },
  { title: "Trauma and Recovery", authors: ["Herman"], category: "trauma", layer: "clinical", priority: 3, rights_status: "licensed", unlocks: "trauma framework" },
  { title: "In the Realm of Hungry Ghosts", authors: ["Maté"], category: "addiction", layer: "clinical", priority: 3, rights_status: "licensed", unlocks: "addiction analysis" },
  { title: "Zanarini on BPD longitudinal course", category: "addiction", layer: "clinical", priority: 3, rights_status: OA, unlocks: "BPD course evidence" },

  // ---- Part 6 — First-person accounts (PHEN) ----
  { title: "The Center Cannot Hold", authors: ["Saks"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "psychosis from inside" },
  { title: "An Unquiet Mind", authors: ["Jamison"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "mania from inside" },
  { title: "Darkness Visible", authors: ["Styron"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "depression from inside" },
  { title: "The Noonday Demon", authors: ["Solomon"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "depression account" },
  { title: "The Collected Schizophrenias", authors: ["Wang"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "schizophrenia self-description" },
  { title: "Love's Executioner", authors: ["Yalom"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "therapy-process accounts" },
  { title: "The Man Who Mistook His Wife for a Hat", authors: ["Sacks"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "neurological phenomenology" },
  { title: "The Year of Magical Thinking", authors: ["Didion"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "grief from inside" },
  { title: "A Grief Observed", authors: ["Lewis"], category: "narrative", layer: "phenomenological", priority: 3, rights_status: "licensed", unlocks: "grief from inside" },

  // ---- Part 7 — Reasoning & inference ----
  { title: "Complete Sherlock Holmes", authors: ["Conan Doyle"], category: "reasoning", layer: "reasoning", priority: 4, rights_status: FREE, unlocks: "question-sequencing structure" },
  { title: "How Doctors Think", authors: ["Groopman"], category: "reasoning", layer: "reasoning", priority: 3, rights_status: "licensed", unlocks: "diagnostic-error items" },
  { title: "Thinking, Fast and Slow", authors: ["Kahneman"], category: "reasoning", layer: "reasoning", priority: 3, rights_status: "licensed", unlocks: "cognitive-trap framing" },
  { title: "Every Patient Tells a Story", authors: ["Sanders"], category: "reasoning", layer: "reasoning", priority: 3, rights_status: "licensed", unlocks: "diagnostic narrative" },
  { title: "Diagnostic error literature (Croskerry)", category: "reasoning", layer: "reasoning", priority: 3, rights_status: OA, unlocks: "documented cognitive traps" },

  // ---- Part 9 — Literature for dialogue craft (STYLE, free) ----
  { title: "Chekhov, complete plays and stories", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "talking-past-each-other patterns" },
  { title: "Ibsen — A Doll's House, Hedda Gabler, Ghosts", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "concealment-in-marriage patterns" },
  { title: "Dostoevsky — Notes from Underground, Crime and Punishment", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "self-justification patterns" },
  { title: "Woolf — Mrs Dalloway, To the Lighthouse", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "interior vs spoken word" },
  { title: "Gilman — The Yellow Wallpaper", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "unreliable self-report" },
  { title: "Wharton — Ethan Frome, The House of Mirth", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "repressed speech patterns" },
  { title: "Shakespeare — Lear, Hamlet, Macbeth, Othello", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "subtext + deception patterns" },
  { title: "Conrad — Heart of Darkness", category: "fiction", layer: "style", priority: 4, rights_status: FREE, unlocks: "Colonial-encounter speech patterns" },

  // ---- Part 10 — Transcript corpora ----
  { title: "Counseling and Psychotherapy Transcripts Vols I & II", authors: ["Alexander Street/ProQuest"], category: "transcripts", layer: "phenomenological", priority: 1, rights_status: "licensed", unlocks: "disclosure-precedent table, register-matched voice, move frequency" },
  { title: "APA Psychotherapy Video Series", authors: ["APA"], category: "transcripts", layer: "phenomenological", priority: 1, rights_status: "licensed", unlocks: "demonstrated technique across modalities" },
  { title: "Gloria films (Rogers/Perls/Ellis)", category: "transcripts", layer: "phenomenological", priority: 2, rights_status: "licensed", unlocks: "three-modality comparison" },
  { title: "Beck Institute recordings", category: "transcripts", layer: "phenomenological", priority: 2, rights_status: "licensed", unlocks: "CBT delivery exemplars" },
  { title: "MedEdPORTAL standardized-patient scripts", category: "transcripts", layer: "clinical", priority: 4, rights_status: OA, unlocks: "professionally authored SP cases" },
  { title: "Adult Attachment Interview transcripts", category: "transcripts", layer: "clinical", priority: 2, rights_status: "licensed", unlocks: "attachment coding exemplars" },

  // ---- Part 11 — Free, ingest today ----
  { title: "PubMed Central OA subset (psychiatric case reports)", category: "narrative", layer: "clinical", priority: 1, rights_status: OA, unlocks: "5,000+ case reports for the library + SCT/SMC items" },
  { title: "BMC Psychiatry OA", category: "narrative", layer: "clinical", priority: 1, rights_status: OA, unlocks: "open case reports" },
  { title: "Case Reports in Psychiatry", category: "narrative", layer: "clinical", priority: 1, rights_status: OA, unlocks: "open case reports" },
  { title: "Cureus", category: "narrative", layer: "clinical", priority: 1, rights_status: OA, unlocks: "open case reports" },
  { title: "PLOS / Frontiers in Psychiatry", category: "narrative", layer: "clinical", priority: 1, rights_status: OA, unlocks: "open case reports" },
  { title: "Open Test Archive", category: "reasoning", layer: "reasoning", priority: 3, rights_status: OA, unlocks: "test materials" },
  { title: "OpenStax Psychology", category: "guideline", layer: "clinical", priority: 3, rights_status: OA, unlocks: "psychology grounding" },
  { title: "Noba Project", category: "guideline", layer: "clinical", priority: 3, rights_status: OA, unlocks: "psychology grounding" },
  { title: "StoryCorps / Partition Archive oral histories", category: "transcripts", layer: "phenomenological", priority: 3, rights_status: OA, unlocks: "ordinary-life narration" },
];

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });

  let inserted = 0;
  for (const s of SEEDS) {
    const { error } = await admin.from("rights_registry").upsert(
      { ...s, updated_at: new Date().toISOString() },
      { onConflict: "title" },
    );
    if (error) {
      console.error(`  ✗ ${s.title}: ${error.message}`);
      continue;
    }
    inserted++;
  }
  console.log(`Seeded ${inserted}/${SEEDS.length} registry rows.`);
  console.log("None of these rows block the free tier — the ingester only touches public_domain/open_access/licensed anyway.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});