import { redirect } from "next/navigation";

/** Learn moved out of Practice into Study. Old links keep working. */
export default async function OldLearn({ params, searchParams }: { params: Promise<{ rest?: string[] }>; searchParams: Promise<Record<string, string>> }) {
  const { rest } = await params;
  const qs = new URLSearchParams(await searchParams).toString();
  const path = rest?.length ? `/study/${rest.join("/")}` : "/study";
  redirect(qs ? `${path}?${qs}` : path);
}
