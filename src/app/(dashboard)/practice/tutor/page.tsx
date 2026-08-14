import { PageHeader } from "@/components/design-system/page-header";
import { requireFeature } from "@/lib/flags";
import { TutorChat } from "@/components/knowledge/tutor-chat";

/**
 * /practice/tutor — the Psychology Tutor. Grounded Q&A over the authorised
 * book corpus: every answer is retrieval-first (real passages + source
 * citations), with an AI synthesis added only when a no-train provider is on.
 * Gated behind the `knowledge_tutor` feature flag.
 */
export default async function TutorPage() {
  await requireFeature("knowledge_tutor");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Psychology Tutor"
        description="Ask anything about psychology and psychiatry. Answers come from the authorised book corpus — Kaplan & Sadock, DSM-5-TR, Stahl, Maudsley, Fish, Ahuja, ICD-11 — with source citations."
      />
      <div className="mt-6">
        <TutorChat />
      </div>
    </div>
  );
}
