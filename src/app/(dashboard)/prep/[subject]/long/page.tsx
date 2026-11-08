import { redirect } from "next/navigation";

/** /prep/<subject>/long: the subject page's Long answers tab. */
export default async function LongSubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  redirect(`/prep/${encodeURIComponent(subject)}?tab=long`);
}
