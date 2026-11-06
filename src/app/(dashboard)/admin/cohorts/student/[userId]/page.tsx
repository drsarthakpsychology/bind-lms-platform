import { notFound, redirect } from "next/navigation";

/** Moved: one student, one page — Students → profile → Access & login. */
export default async function PersonAccessRedirect({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(userId)) notFound();
  redirect(`/admin/students/${userId}?tab=access`);
}
