import Link from "next/link";
import { personKey } from "@/lib/crm/people";
import { cn } from "@/lib/utils";

/**
 * The same row of links on every page about one person, so you can jump
 * between their access, activity, pipeline record, switches and mail.
 */
export function PersonLinks({ userId, email, here }: { userId: string | null; email: string; here: "profile" | "access" | "activity" | "people" | "switches" }) {
  const links: [string, string, string][] = [
    ...(userId
      ? ([
          ["profile", "Student profile", `/admin/students/${userId}`],
          ["access", "Access & login", `/admin/students/${userId}?tab=access`],
          ["activity", "Activity", `/admin/students/${userId}?tab=activity`],
        ] as [string, string, string][])
      : []),
    ["people", "Pipeline record", `/admin/people/${personKey(email)}`],
    ["switches", "Switch sections", `/admin/access?q=${encodeURIComponent(email)}`],
    ["mail", "Email them", `/admin/emails?folder=compose&to=${encodeURIComponent(email)}`],
  ];
  return (
    <nav aria-label="About this person" className="flex flex-wrap gap-2">
      {links.map(([k, label, href]) => (
        <Link
          key={k}
          href={href}
          aria-current={k === here ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center rounded-full border-2 border-foreground px-3.5 text-sm font-bold",
            k === here ? "bg-foreground text-background" : "bg-card hover:bg-muted",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
