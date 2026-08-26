"server-only";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import type { MedicationDocument } from "./document";

/**
 * The published medication document for a generic name. Content is identical
 * for every student (published KMS docs are cohort-wide reference), so it is
 * cached across requests/instances (1h) and revalidated by tag when an admin
 * publishes/edits a document (Part 11). Uses the service-role client because
 * unstable_cache runs outside the request scope (no cookies available).
 */
export const getPublishedMedicationDocument = unstable_cache(
  async (generic: string): Promise<MedicationDocument | null> => {
    const admin = createAdminClient();
    const { data: drugRow } = await admin
      .from("psych_drugs")
      .select("id")
      .eq("generic_name", generic)
      .maybeSingle();
    if (!drugRow) return null;
    const { data } = await admin
      .from("medication_documents")
      .select("document")
      .eq("drug_id", drugRow.id)
      .eq("status", "published")
      .maybeSingle();
    return (data as { document: MedicationDocument | null } | null)?.document ?? null;
  },
  ["psych-doc"],
  { revalidate: 3600, tags: ["psych-doc"] },
);
