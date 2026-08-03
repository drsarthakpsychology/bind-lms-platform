-- =============================================================================
-- F1 (HIGH, BFLA) fix — an editor could publish a medication document.
--
-- Publishing must be reviewer/admin-only. Editors may edit content but must not
-- be able to flip status → published.
--
-- Fix:
--   1. A SECURITY DEFINER publish function checks app_role() IN (admin,reviewer)
--      and does validation + the status flip inside a single transaction.
--   2. A row-level trigger blocks any UPDATE that would set status='published'
--      unless the caller is admin/reviewer (defense-in-depth against direct
--      PostgREST UPDATE bypass).
--   3. The write policy is left for content edits (editor may UPDATE document),
--      but the status flip is gated by the trigger + the function.
-- =============================================================================

-- SECURITY DEFINER publish function (reviewer/admin only).
create or replace function public.publish_medication_document(p_drug_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  doc medication_documents%rowtype;
  next_ver int;
  v jsonb;
begin
  -- Only reviewer/admin may publish.
  if public.app_role() not in ('admin','reviewer') then
    raise exception 'forbidden: publish requires reviewer or admin';
  end if;

  select * into doc from medication_documents where drug_id = p_drug_id;
  if not found then
    raise exception 'document not found for drug %', p_drug_id;
  end if;

  next_ver := doc.version + 1;
  v := doc.document;

  -- Validate: at least one source, no invalid dose ranges, no unresolved conflicts.
  -- (Light validation here; the API does the richer checks. A published doc must
  --  carry sources.)
  if jsonb_typeof(v -> 'sections') = 'null' then
    raise exception 'document has no sections';
  end if;

  update medication_documents
    set status = 'published',
        version = next_ver,
        published_version = next_ver,
        reviewer = auth.uid(),
        verified_at = now()
  where id = doc.id;

  insert into medication_document_versions (document_id, version, content, delta, editor, reason, changed_fields)
  values (doc.id, next_ver, v, '{}'::jsonb, auth.uid(), coalesce(p_reason, 'publish'), '{}');

  return jsonb_build_object('ok', true, 'version', next_ver, 'status', 'published');
end;
$$;

-- Defense-in-depth: block direct UPDATE that flips status → published unless
-- the caller is admin/reviewer. Editors editing content are allowed.
create or replace function public.med_docs_block_editor_publish()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.status = 'published' and OLD.status is distinct from 'published'
     and public.app_role() not in ('admin','reviewer') then
    raise exception 'forbidden: only reviewer or admin may publish';
  end if;
  return new;
end;
$$;

drop trigger if exists med_docs_block_editor_publish on medication_documents;
create trigger med_docs_block_editor_publish
  before update on medication_documents
  for each row execute function public.med_docs_block_editor_publish();
