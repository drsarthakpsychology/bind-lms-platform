import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { istDay } from "@/lib/certificates/kinds";
import { layoutCertificate } from "@/lib/certificates/layout";
import { previewDoc, previewImages, studioProblems } from "@/lib/certificates/preview";
import { signatureOptions, siteBase, studioReady } from "@/lib/certificates/server";
import { appRoute } from "@/lib/app-api/route";
import type { StudioPreview } from "@/lib/app-api/contract-practise-admin";
import { studioSchema } from "../schema";

export const runtime = "nodejs";

const schema = studioSchema.extend({ showing: z.number().int().min(0).max(1000).optional(), recipients: studioSchema.shape.recipients });

/**
 * POST /api/app/v1/admin/certificates/preview: the certificate as the
 * student will see it, as the website's own layout (drawing operations, the
 * same the website draws and prints), and what still stops it being issued.
 * Writes nothing. Any admin.
 */
export const POST = appRoute({ auth: "admin" }, async ({ user, body, limitFast }): Promise<StudioPreview> => {
  limitFast(`app:certpreview:${user.profile.id}`, 120);
  const b = await body(schema, 64_000);
  const admin = createAdminClient();
  const [ready, saved] = await Promise.all([studioReady(admin), signatureOptions(admin).catch(() => [])]);
  const fields = { kind: b.kind, heading: b.heading ?? "", lead: b.lead ?? "", connector: b.connector ?? "", title: b.title, citation: b.citation ?? "", courseLabel: b.courseLabel ?? "", moduleLabel: b.moduleLabel ?? "", issuedOn: b.issuedOn, expiresOn: b.expiresOn ?? "", signatories: b.signatories.map((s) => ({ ...s, signatureFrom: s.signatureFrom ?? null })) };
  const shown = b.recipients[Math.min(b.showing ?? 0, Math.max(0, b.recipients.length - 1))];
  const layout = layoutCertificate(previewDoc(fields, shown?.name ?? "", siteBase()));
  return {
    v: 1,
    width: layout.w,
    height: layout.h,
    ops: layout.ops as unknown as Record<string, unknown>[],
    images: previewImages(fields.signatories, saved),
    problems: studioProblems({ ...fields, picked: b.recipients, ready, today: istDay(new Date()) }).map((p) => p.text),
  };
});
