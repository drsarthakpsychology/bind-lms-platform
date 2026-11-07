import { notFound, redirect } from "next/navigation";

/** Moved: one student, one page, Students → profile → Activity. */
export default async function StudentActivityRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  redirect(`/admin/students/${id}?tab=activity`);
}
