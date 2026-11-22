import { redirect } from "next/navigation";

/** /study/reference: the old Quick reference A to Z now lives inside Quick Notes. Keeps ?q= and ?kind=. */
export default async function ReferencePage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string }> }) {
  const sp = await searchParams;
  const u = new URLSearchParams();
  if (sp.q) u.set("q", sp.q.slice(0, 80));
  const type = sp.kind === "disorder" ? "criteria" : sp.kind === "medicine" ? "pharm" : sp.kind === "term" ? "term" : null;
  if (type) u.set("type", type);
  const qs = u.toString();
  redirect(qs ? `/study/notes?${qs}` : "/study/notes");
}
