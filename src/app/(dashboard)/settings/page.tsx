import { MiddleTruncate } from "@/components/ui/middle-truncate";
import { Bell } from "lucide-react";
import { ColourBlindToggle } from "@/components/settings/colour-blind-toggle";
import { ReactionsToggle } from "@/components/reactions/reactions-toggle";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { MobilePage } from "@/components/mobile/mobile-page";
import { PageHeader } from "@/components/design-system/page-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { BRAND } from "@/lib/brand";
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
 *
 * Design pass (Nov 2026): settings only. The old "Shortcuts" (Courses, Wall)
 * repeated the main menu, the Account section repeated the email already in
 * the header block, and Accessibility was hidden in a grey fold at the
 * bottom. Now: who you are, the two preferences, notifications, log out.
 */

export default async function SettingsPage() {
  const session = await getSession();
  if (session.status !== "ok") return leaveWithoutSession(session);

  const { email, role } = session.profile;
  const roleLabel = ROLE_LABEL[role] ?? role;

  return (
    <MobilePage inset={false}>
      <PageHeader title="Settings" className="pb-0" />
      <div className="flex max-w-2xl flex-col gap-7 pt-4">
        {/* Who is signed in: one honest block (no fake name). */}
        <div className="flex items-center gap-3 rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm">
          <div
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-pix text-lg text-primary-foreground"
          >
            {(email?.[0] ?? "S").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <MiddleTruncate text={email ?? "Signed in"} className="text-body font-semibold text-foreground" />
            <p className="mt-0.5 text-small text-muted-foreground">
              {roleLabel} · {BRAND.shortName}
            </p>
          </div>
        </div>

        {/* The two things this device remembers for you. */}
        <MobileSection title="Learning">
          <div className="rounded-lg border-2 border-foreground bg-card px-4 hard-shadow-xs">
            <ReactionsToggle />
          </div>
        </MobileSection>

        <MobileSection title="Accessibility">
          <div className="rounded-lg border-2 border-foreground bg-card px-4 hard-shadow-xs">
            <ColourBlindToggle />
          </div>
        </MobileSection>

        <MobileSection title="Notifications">
          <MobileListItem
            href="/notifications"
            leading={<Bell className="size-4 text-foreground" aria-hidden />}
            title="Your notifications"
            subtitle="Replies to your posts and anything that needs you."
          />
        </MobileSection>

        <div className="border-t-2 border-border pt-5">
          <form action={logout}>
            <LogoutButton />
          </form>
          <p className="mt-2 text-center text-caption text-muted-foreground">Your progress stays saved.</p>
        </div>
      </div>
    </MobilePage>
  );
}
