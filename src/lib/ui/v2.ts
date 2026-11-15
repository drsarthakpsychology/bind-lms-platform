/**
 * The `ui_v2` switch: the new design (docs/design/DESIGN_SYSTEM_2026_11.md).
 * One row in feature_flags (key "ui_v2"):
 *   no row (or "live") → on for admins only, including "view as student"
 *   "unlocked" (= on)  → on for everyone
 *   "off"              → on for nobody
 * Pure, so the shell, Home and every v2 screen ask the same question.
 * Server code: `uiV2For(await readFlags(), profile.role)`.
 */
export const UI_V2_FLAG = "ui_v2";

export function uiV2For(flags: Record<string, string | undefined> | null | undefined, role: string | null | undefined): boolean {
  const s = flags?.[UI_V2_FLAG];
  if (s === "unlocked" || s === "on") return true;
  if (s === "off") return false;
  return role === "admin" || role === "view_admin";
}
