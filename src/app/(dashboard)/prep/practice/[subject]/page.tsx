import { notFound, redirect } from "next/navigation";
import { isSubject } from "@/lib/prep/catalog";

/** Old address: /prep/practice/<subject> is now the subject's topic list. */
export default async function OldPracticePage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  if (!isSubject(subject)) notFound();
  redirect(`/prep/${subject}`);
}
