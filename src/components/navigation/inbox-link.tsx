import Link from "next/link";
import { Inbox } from "lucide-react";
import { badgeText } from "@/app/(dashboard)/admin/inbox/logic";
import { cn } from "@/lib/utils";
import { TOP_BAR_COUNT, TOP_BAR_ICON_BTN } from "./icon-button";

/**
 * Admin top-bar Inbox (next to the bell): unanswered doubts + unread student
 * email replies. The number is also in the accessible name, so the count is
 * never colour-only.
 */
export function InboxLink({ count, doubts = 0, emails = 0 }: { count: number; doubts?: number; emails?: number }) {
  const text = badgeText(count);
  const name = count
    ? `Inbox, ${count} waiting (${doubts} doubt${doubts === 1 ? "" : "s"}, ${emails} email${emails === 1 ? "" : "s"})`
    : "Inbox, nothing waiting";
  return (
    <Link href="/admin/inbox" aria-label={name} title={name} className={cn(TOP_BAR_ICON_BTN, "relative")}>
      <Inbox className="size-5" aria-hidden />
      {text ? (
        <span aria-hidden className={TOP_BAR_COUNT}>
          {text}
        </span>
      ) : null}
    </Link>
  );
}
