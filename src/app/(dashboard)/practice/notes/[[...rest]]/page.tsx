import { redirect } from "next/navigation";

/** Notes moved into Study. Old links keep working. */
export default async function OldNotes({ params }: { params: Promise<{ rest?: string[] }> }) {
  const { rest } = await params;
  redirect(rest?.length ? `/study/notes/${rest.join("/")}` : "/study/notes");
}
