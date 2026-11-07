import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { RevisitPage, pageParam } from "../revisit";

export const metadata: Metadata = { title: "Wrong answers" };

/** /prep/wrong[?page=N]: questions whose last answer was wrong, 10 at a time. */
export default async function WrongPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  await requireFeature("learn");
  return <RevisitPage kind="wrong" page={pageParam((await searchParams).page)} />;
}
