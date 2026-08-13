/**
 * Write-time markup stripping for free-text inputs.
 *
 * React escapes text when rendering, so stored fields are already safe on the
 * current admin render path. This is defense-in-depth: removing HTML/script
 * markup at write time means no future render path (raw-HTML export, email, a
 * tool that emits these fields verbatim) can ever execute a stored payload.
 *
 * Text content is preserved, including literal `<` and `>` in prose; only
 * tag-like sequences (`<...>`) are removed.
 */
export function stripMarkup(s: string): string {
  return s.replace(/<[^>]*>/g, "");
}
