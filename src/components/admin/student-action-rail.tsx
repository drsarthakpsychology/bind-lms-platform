"use client";

import Link from "next/link";
import { Award, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SendLinkButton } from "@/app/(dashboard)/admin/students/[id]/send-link-button";
import { openAddPeople } from "./add-people-panel";
import { cn } from "@/lib/utils";

const rail = "w-full justify-center pointer-coarse:min-h-11 sm:w-auto";

/**
 * Student 360 action rail (DI §C-8): the four jobs an admin does for one
 * person, next to the person. Message · Add to cohort · Send login link ·
 * Issue certificate. Two-by-two on phones, one row on wider screens.
 * View Admins only get the links (the target pages enforce write rights).
 */
export function StudentActionRail({ id, email, canWrite, className }: { id: string; email: string; canWrite: boolean; className?: string }) {
  return (
    <div role="group" aria-label="Actions for this student" className={cn("grid grid-cols-2 gap-2 sm:flex sm:flex-wrap", className)}>
      <Button asChild variant="outline" size="sm" className={rail}>
        <Link href={`/admin/emails?folder=notify&to=${encodeURIComponent(email)}`}>
          <Bell aria-hidden /> Message
        </Link>
      </Button>
      {canWrite ? (
        <>
          <Button type="button" variant="outline" size="sm" className={rail} onClick={() => openAddPeople(undefined, email)}>
            <Users aria-hidden /> Add to cohort
          </Button>
          <SendLinkButton email={email} className={rail} />
        </>
      ) : null}
      <Button asChild variant="outline" size="sm" className={rail}>
        <Link href={`/admin/credentials?student=${id}`}>
          <Award aria-hidden /> Issue certificate
        </Link>
      </Button>
    </div>
  );
}

/** The next-step button when it needs the client (send link / add to cohort). */
export function NextStepAction({ action, email }: { action: "login-link" | "add-cohort"; email: string }) {
  if (action === "login-link") return <SendLinkButton email={email} variant="default" className="pointer-coarse:min-h-11" />;
  return (
    <Button type="button" size="sm" className="pointer-coarse:min-h-11" onClick={() => openAddPeople(undefined, email)}>
      <Users aria-hidden /> Add to cohort
    </Button>
  );
}
