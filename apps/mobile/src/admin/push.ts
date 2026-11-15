import type { AdminPushData, AdminPushKind } from "./extra";

/**
 * The three admin push notices and where a tap leads:
 *   new_doubt       a student asked a doubt or raised a concern -> that doubt
 *   new_enquiry     someone filled the public enquiry form       -> their pipeline record
 *   falling_behind  a student fell behind their cohort           -> the student (or the list)
 */
export const ADMIN_PUSH: Record<AdminPushKind, { title: string; about: string; pref: "newDoubt" | "newEnquiry" | "fallingBehind" }> = {
  new_doubt: { title: "New doubts and concerns", about: "When a student asks a doubt or raises a concern.", pref: "newDoubt" },
  new_enquiry: { title: "New enquiries", about: "When someone fills the enquiry form on the website.", pref: "newEnquiry" },
  falling_behind: { title: "Students falling behind", about: "Once a day, when a student falls behind their cohort.", pref: "fallingBehind" },
};

export function isAdminPush(data: unknown): data is AdminPushData {
  const d = data as Partial<AdminPushData> | null | undefined;
  return !!d && typeof d === "object" && typeof d.admin === "string" && d.admin in ADMIN_PUSH;
}

/** The admin screen for a tapped admin notice; null when the notice is not an admin one. */
export function adminHrefFromPush(data: unknown): string | null {
  if (!isAdminPush(data)) return null;
  const id = data.id ? encodeURIComponent(data.id) : null;
  switch (data.admin) {
    case "new_doubt":
      return id ? `/admin/doubt/${id}` : "/admin/doubts";
    case "new_enquiry":
      return id ? `/admin/person/${id}` : "/admin/people?tab=enquiries";
    case "falling_behind":
      return id ? `/student/${id}?tab=activity` : "/admin/activity?view=behind";
    default:
      return null;
  }
}
