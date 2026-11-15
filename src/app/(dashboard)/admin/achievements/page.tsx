import { redirect } from "next/navigation";

/** The old "Badges & certificate types" address: now Certificates, Types. */
export default function AchievementsAdminPage() {
  redirect("/admin/credentials/types");
}
