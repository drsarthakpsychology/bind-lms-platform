import { MiddleTruncate } from "@/components/ui/middle-truncate";
import { Bell, MessageSquare, Shield, User } from "lucide-react";
import { ColourBlindToggle } from "@/components/settings/colour-blind-toggle";
import { ReactionsToggle } from "@/components/reactions/reactions-toggle";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { MobilePage } from "@/components/mobile/mobile-page";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { StatusPill } from "@/components/mobile/status-pill";
import { BRAND } from "@/lib/brand";
import { loadMyBlocks } from "@/lib/access/blocks";
import { blockedBy } from "@/lib/access/features";
import { LogoutButton } from "@/components/navigation/logout-button";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", view_admin: "Admin (view only)", student: "Student", alumni: "Alumni" };
import { leaveWithoutSession } from "@/lib/auth/session-redirect";

/**
 * /settings: grouped progressive account screen (T41).
 *
 * The mobile principle: settings is NOT a giant scroll of every toggle. It is
 * a few grouped sections (Account, Shortcuts) each revealing its details
 * contextually, with one obvious action (log out) at the end.
 *
 * Honest data: profiles has id/role/active_session_token/expires_at (no
 * display_name/avatar), so the identity header shows the email + role from the
 * session, never a fabricated name. Preference toggles that the app does not
 * actually store are not rendered as fake switches; what exists here is real.
 */

export default async function SettingsPage() {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);

  const { email, role } = session.profile;
  const roleLabel = ROLE_LABEL[role] ?? role;
  // The Wall shortcut only where the Wall opens for this student.
  const showWall = role !== "student" || !blockedBy("/wall", await loadMyBlocks(session.profile.id));

  return (
    <MobilePage inset={false}>
      <MobileHeader title="Settings" inset={false} />
      <div className="flex flex-col gap-6 px-4 py-4">
        {/* Identity: one honest block, not a fake name. */}
        <div className="flex items-center gap-3 rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm">
          <div
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-lg text-primary-foreground"
          >
            {(email?.[0] ?? "S").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <MiddleTruncate text={email ?? "Signed in"} className="text-small font-semibold text-foreground" />
            <p className="mt-0.5 flex items-center gap-1.5 text-caption text-muted-foreground">
              <span>{roleLabel}</span>
              <span aria-hidden>·</span>
              {BRAND.shortName}
            </p>
          </div>
          <StatusPill tone="neutral" label="Signed in" />
        </div>

        {/* Account: what the app actually knows. */}
        <MobileSection title="Account" description="Your sign-in and role on the programme.">
          <MobileListItem
            leading={<User className="size-4 text-foreground" aria-hidden />}
            title="Email address"
            subtitle={email ?? "Not set"}
          />
          <MobileListItem
            leading={<Shield className="size-4 text-foreground" aria-hidden />}
            title="Role"
            subtitle={roleLabel}
          />
        </MobileSection>

        {/* Shortcuts: quick jumps, kept honest (they don't change settings). */}
        <MobileSection title="Shortcuts" description="Quick jumps around the programme.">
          <MobileListItem
            href="/courses"
            leading={<span className="font-mono text-xs font-bold text-link">01</span>}
            title="Lectures"
            subtitle="Your recorded classes."
          />
          <MobileListItem
            href="/notifications"
            leading={<Bell className="size-4 text-foreground" aria-hidden />}
            title="Notifications"
            subtitle="Messages from the VIBHA team, answers to your doubts and badges."
          />
          {showWall ? (
            <MobileListItem
              href="/wall"
              leading={<MessageSquare className="size-4 text-foreground" aria-hidden />}
              title="Cohort wall"
              subtitle="Posts, replies and reactions from your cohort."
            />
          ) : null}
        </MobileSection>

        {/* Learning: the one study preference this device keeps. */}
        <MobileSection title="Learning">
          <div className="rounded-lg border-2 border-foreground bg-card px-4 hard-shadow-xs">
            <ReactionsToggle />
          </div>
        </MobileSection>

        {/* Accessibility: kept closed and quiet at the bottom on purpose. */}
        <details className="group rounded-lg border-2 border-line px-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-small text-muted-foreground [&::-webkit-details-marker]:hidden">
            Accessibility
            <span aria-hidden className="transition-transform duration-fast group-open:rotate-90">›</span>
          </summary>
          <div className="border-t border-line pb-2">
            <ColourBlindToggle />
          </div>
        </details>

        <div className="border-t-2 border-border pt-4">
          <form action={logout}>
            <LogoutButton />
          </form>
          <p className="mt-2 text-center text-caption text-muted-foreground">
            Signing out keeps your progress, just sign back in.
          </p>
        </div>
      </div>
    </MobilePage>
  );
}
