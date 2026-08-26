# Admin content editing — the one philosophy (T104)

Every content editor in VIBHA follows the same shape, so an administrator who
can edit one thing can edit everything. The rule: **open content → edit the
fields → save (or autosave) → preview → publish.** The underlying data model
is never part of the screen.

## The shared loop

1. **Open.** Content is a list; "Open" (or the row itself) takes you to the
   single editing surface. No scatter of per-type editors.
2. **Edit the fields, not the schema.** The screen shows the human fields —
   title, body, options, media. Database enums, source strings, version
   numbers and ids are labelled in plain words when they must appear, hidden
   when they don't.
3. **Save / autosave.** A draft is written continuously (the medication
   editor autosaves every change) or a clear "Save" button persists it. Saving
   never throws the editor away.
4. **Preview.** Before publish, the editor shows the content the way the
   student will see it — the lesson preview shows the title + notes under the
   video; the medication editor previews the live student page.
5. **Publish.** One clearly-separated action makes it student-visible.
   Everything else is a draft.

## What this looks like per content type

| Surface | Editor | Save | Preview | Publish |
|---|---|---|---|---|
| Courses / lessons | `admin/courses/[courseId]` + `lesson-form.tsx` | form submit | live preview (title + notes) | course `is_published` |
| Modules | `admin/modules` | per-row actions | state chips | module state (draft/scheduled/published) |
| Study cards | `admin/cards` | per-card edit | front + back shown | Approve → published |
| Idiom bank | `admin/idioms` | per-row edit | phrase + trap shown | Approve |
| Medication | `admin/psychopharm/editor/[drug]` | **autosave** | live student page | Publish to students |
| Practice cases | `corpus/dictate` | conversation → structured case | review before save | approve |

## Rules that hold everywhere

- **Never expose a CLI command, a table name, an enum, or a route path** in an
  editing surface. If an admin needs it, it is not a content editor — it is a
  tool, and it belongs in a different place.
- **One name for one state.** "Draft / In review / Published" everywhere (never
  raw `draft`, `in_review`, `published` strings).
- **Preview is the student's truth.** If the preview can't be the real student
  render, show a faithful mock. A preview that lies is worse than none.
- **Publish is explicit and last.** Students never see a half-saved edit by
  accident.

## Status

All editors now follow the loop: cards and idioms show their content
(front/back, phrase/trap) as the preview and Approve to publish; the lesson
form has live preview; the medication editor is the reference (autosave,
live student-page preview, explicit publish); modules manage state + access.
The one nice-to-have left is a preview-as-student toggle on modules (the
student view of a scheduled module) — noted in IDEAS_NEXT, not load-bearing.
