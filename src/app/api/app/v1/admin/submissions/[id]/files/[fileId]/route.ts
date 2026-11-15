import { getSubmissionFileUrl } from "@/app/(dashboard)/admin/submissions/actions";
import { createAdminClient } from "@/lib/supabase/server";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { uuid } from "@/lib/app-api/schemas";
import type { AdminFileLink } from "@/lib/app-api/contract-practise-admin";

export const runtime = "nodejs";

/** GET /api/app/v1/admin/submissions/:id/files/:fileId: a 15 minute address for one handed-in file. The storage path is looked up here, never taken from the app. */
export const GET = appRoute<{ id: string; fileId: string }>({ auth: "admin" }, async ({ user, params, limitFast }): Promise<AdminFileLink> => {
  if (!uuid.safeParse(params.id).success || !uuid.safeParse(params.fileId).success) throw new ApiFail("not_found");
  limitFast(`app:subfile:${user.profile.id}`, 120);
  const { data } = await createAdminClient().from("submission_files").select("storage_path").eq("id", params.fileId).eq("submission_id", params.id).maybeSingle();
  const path = (data as { storage_path?: string | null } | null)?.storage_path;
  if (!path) throw new ApiFail("not_found");
  const r = await getSubmissionFileUrl(path);
  if (!r.url) throw new ApiFail(r.error === "Not authorized." ? "forbidden" : "unavailable", r.error ?? undefined);
  return { url: r.url, expiresInSeconds: 900 };
});
