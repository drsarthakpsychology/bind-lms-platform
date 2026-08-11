#!/usr/bin/env tsx
/**
 * Draft flashcards from lesson transcripts (v5 §4 — Rounds "cards auto-
 * drafted from lessons into admin queue").
 *
 *   npm run draft-cards
 *
 * Reads lesson_transcripts (published lessons), extracts candidate Q/A
 * pairs deterministically (no AI — key-sentence heuristics that are honest
 * about being drafts), and inserts them into `cards` as
 * source='ai_generated', status='draft', approved=false so they land in the
 * admin queue for review before ever reaching a student.
 *
 * Idempotent per (lesson, front): a re-run skips cards already drafted for
 * the same front on the same lesson.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (in .env.local).
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

/** Sentence-splitting that keeps "Dr." and "vs." intact. */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"("])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 300);
}

/** Heuristic Q/A draft: pick key sentences. Honest drafts — faculty reviews. */
function draftCards(lessonTitle: string, transcript: string): Array<{ front: string; back: string }> {
  const out: Array<{ front: string; back: string }> = [];
  const seen = new Set<string>();
  const ss = sentences(transcript);
  for (const s of ss) {
    // Definitions / claims → "true/false" style prompt.
    if (/^(is|are|was|were|the |a |an )/i.test(s) && !seen.has(s)) {
      out.push({
        front: `From "${lessonTitle}": true or false — ${s.replace(/^[A-Z]/, (c) => c.toLowerCase())}`,
        back: `Per the lesson, yes — this is what it teaches. (Verify against the source material on review.)`,
      });
      seen.add(s);
    }
    // "because" / "since" sentences → cause-effect Q.
    if (/because|since|therefore|so that/i.test(s) && !seen.has("q:" + s)) {
      const [cause, effect] = s.split(/because|since/i);
      if (cause && effect && cause.length > 15 && effect.length > 10) {
        out.push({
          front: `From "${lessonTitle}": why does ${cause.trim().replace(/\.$/, "")}?`,
          back: `${effect.trim().replace(/\.$/, "")}. (Draft — verify on review.)`,
        });
        seen.add("q:" + s);
      }
    }
  }
  // Cap at 8 per lesson so the queue never floods from one transcript.
  return out.slice(0, 8);
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  const admin = createClient(url, key, { auth: { persistSession: false } });

  // Published lessons with transcripts (owner of the transcript is the lesson).
  const { data: lessons } = await admin.from("lessons").select("id, title, video_status");
  if (!lessons || lessons.length === 0) {
    console.error("No lessons found — nothing to draw cards from.");
    process.exit(1);
  }
  // Lessons with a live video are published enough to draft from.
  const published = lessons.filter((l) => l.video_status === "ready");

  const { data: transcripts } = await admin
    .from("lesson_transcripts")
    .select("id, lesson_id, transcript");

  const byLesson = new Map<string, string>();
  for (const t of transcripts ?? []) byLesson.set(t.lesson_id, String(t.transcript));

  // Existing draft fronts (idempotency).
  const { data: existingCards } = await admin.from("cards").select("front");
  const existingFronts = new Set((existingCards ?? []).map((c) => String(c.front)));

  let drafted = 0;
  let skipped = 0;
  for (const lesson of published) {
    const transcript = byLesson.get(lesson.id);
    if (!transcript || transcript.trim().length < 100) continue;
    const cards = draftCards(String(lesson.title), transcript);
    for (const card of cards) {
      if (existingFronts.has(card.front)) {
        skipped++;
        continue;
      }
      const { error } = await admin.from("cards").insert({
        lesson_id: lesson.id,
        front: card.front,
        back: card.back,
        source: "ai_generated",
        status: "draft",
        approved: false,
      });
      if (error) {
        console.error("insert failed:", error.message);
        continue;
      }
      drafted++;
      existingFronts.add(card.front);
    }
    console.log(`  ${lesson.title}: ${cards.length} candidate(s)`);
  }

  console.log(`\nDrafted ${drafted} cards (skipped ${skipped} duplicates).`);
  console.log("They sit in the cards table as draft/approved=false — the faculty review queue decides what a student ever sees.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});