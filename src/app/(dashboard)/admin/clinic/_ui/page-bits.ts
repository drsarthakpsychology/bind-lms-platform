import { redirect } from "next/navigation";

import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";

/** Every clinic admin page: admins only (View Admin reads, Super Admin writes), and the ?cohort= it was opened with. */
export async function clinicAdmin(sp: Promise<{ cohort?: string }>) {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  const { cohort } = await sp;
  const id = cohort && /^[0-9a-f-]{36}$/i.test(cohort) ? cohort : undefined;
  return { me, canWrite: isSuperAdmin(me), cohort: id, q: id ? `?cohort=${id}` : "" };
}
