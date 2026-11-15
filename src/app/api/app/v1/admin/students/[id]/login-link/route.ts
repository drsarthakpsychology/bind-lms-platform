import { sendLoginLink } from "@/app/(dashboard)/admin/cohorts/actions";
import { realRoster } from "@/lib/app-api/admin";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { LoginLinkResult } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** POST /api/app/v1/admin/students/:id/login-link: email a fresh login link (the website's sendLoginLink; super admin only). */
export const POST = appRoute<{ id: string }>({ auth: "superAdmin" }, async ({ user, params, limitWrite }): Promise<LoginLinkResult> => {
  if (!uuid.safeParse(params.id).success) throw new ApiFail("not_found");
  await limitWrite(`app:loginlink:${user.profile.id}`, 20);
  const row = (await realRoster()).find((r) => r.id === params.id);
  if (!row) throw new ApiFail("not_found");
  const r = await sendLoginLink(row.email);
  if (r.error) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "bad_request", r.error);
  return { sent: true };
});
