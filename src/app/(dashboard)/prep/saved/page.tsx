import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { RevisitPage, pageParam } from "../revisit";

export const metadata: Metadata = { title: "Saved questions" };

/** /prep/saved[?page=N]: questions you saved, 10 at a time. */
export default async function SavedPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  await requireFeature("learn");
  return <RevisitPage kind="saved" page={pageParam((await searchParams).page)} />;
}
