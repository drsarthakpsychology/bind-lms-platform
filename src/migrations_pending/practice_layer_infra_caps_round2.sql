-- =============================================================================
-- VIBHA Practice Layer — infra round 2 (v5 Master §9.3, text-column size audit)
-- =============================================================================
-- practice_layer_infra.sql capped the tables that existed when the infra
-- pattern was written (journal_entries, wall_posts, wall_replies,
-- corpus_documents). Everything shipped since then was left uncapped. This
-- migration closes that gap:
--   - live tables that shipped after the infra pattern but were never swept
--     in (formulation_wall_posts, pair_messages, library_notes)
--   - the newest tables (practice_chains, corpus_dictations, sim_cases.
--     follow_up) just applied live in this round
-- Additive + idempotent — safe to run against a DB that already has some of
-- these caps, and safe to re-run.
-- =============================================================================

do $$
begin
  -- formulation_wall_posts.narrative — student peer-critique writeup.
  -- Same order of magnitude as a journal entry.
  if not exists (select 1 from pg_constraint where conname = 'formulation_wall_narrative_cap') then
    alter table public.formulation_wall_posts
      add constraint formulation_wall_narrative_cap check (char_length(narrative) <= 20000);
  end if;

  -- pair_messages.content — peer role-play chat thread, one message per row.
  if not exists (select 1 from pg_constraint where conname = 'pair_messages_content_cap') then
    alter table public.pair_messages
      add constraint pair_messages_content_cap check (char_length(content) <= 5000);
  end if;

  -- library_notes.note — a private annotation on a case-library document.
  if not exists (select 1 from pg_constraint where conname = 'library_notes_note_cap') then
    alter table public.library_notes
      add constraint library_notes_note_cap check (char_length(note) <= 4000);
  end if;

  -- practice_chains.steps — jsonb array of {surface, status, artefact_id,
  -- completed_at}; naturally bounded by tool count, capped defensively.
  if not exists (select 1 from pg_constraint where conname = 'practice_chains_steps_cap') then
    alter table public.practice_chains
      add constraint practice_chains_steps_cap check (char_length(steps::text) <= 50000);
  end if;

  -- sim_cases.follow_up — jsonb spec for a multi-session patient arc.
  if not exists (select 1 from pg_constraint where conname = 'sim_cases_follow_up_cap') then
    alter table public.sim_cases
      add constraint sim_cases_follow_up_cap check (
        follow_up is null or char_length(follow_up::text) <= 20000
      );
  end if;

  -- corpus_dictations.transcript — the full dictation Q&A transcript
  -- (STT'd). The largest of this round's columns by design; capped at the
  -- same order of magnitude as a corpus document, not a journal entry.
  if not exists (select 1 from pg_constraint where conname = 'corpus_dictations_transcript_cap') then
    alter table public.corpus_dictations
      add constraint corpus_dictations_transcript_cap check (char_length(transcript::text) <= 300000);
  end if;

  -- corpus_dictations.state — the interviewer state machine's 21 clinical
  -- fields. Bounded in shape; capped defensively.
  if not exists (select 1 from pg_constraint where conname = 'corpus_dictations_state_cap') then
    alter table public.corpus_dictations
      add constraint corpus_dictations_state_cap check (char_length(state::text) <= 20000);
  end if;

  -- corpus_dictations.final_title — short, title-length text.
  if not exists (select 1 from pg_constraint where conname = 'corpus_dictations_final_title_cap') then
    alter table public.corpus_dictations
      add constraint corpus_dictations_final_title_cap check (
        final_title is null or char_length(final_title) <= 500
      );
  end if;
end $$;
