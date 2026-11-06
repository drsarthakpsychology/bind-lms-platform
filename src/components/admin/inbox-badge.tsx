import { loadInboxCounts } from "@/app/(dashboard)/admin/inbox/data";
import { InboxLink } from "@/components/navigation/inbox-link";

/** Server island for the top bar: reads the Inbox count (streams in behind a Suspense fallback). */
export async function InboxBadge() {
  const c = await loadInboxCounts();
  return <InboxLink count={c.total} doubts={c.doubts} emails={c.emails} />;
}
