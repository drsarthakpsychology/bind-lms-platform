import { Bell, LogOut, MessageSquare, Shield, User } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { MobilePage } from "@/components/mobile/mobile-page";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileSection } from "@/components/mobile/mobile-section";
import { MobileListItem } from "@/components/mobile/mobile-list-item";
import { StatusPill } from "@/components/mobile/status-pill";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

/**
 * /settings — grouped progressive account screen (T41).
 *
 * The mobile principle: settings is NOT a giant scroll of every toggle. It is
 * a few grouped sections — Account, Shortcuts — each revealing its details
 * contextually, with one obvious action (log out) at the end.
 *
 * Honest data: profiles has id/role/active_session_token/expires_at (no
 * display_name/avatar), so the identity header shows the email + role from the
 * session — never a fabricated name. Preference toggles that the app does not
 * actually store are not rendered as fake switches; what exists here is real.
 */

export default async function SettingsPage() {
  const session = await getSession();
  if (session.status !== "ok") return null; // shell already redirected

  const { email, role } = session.profile;

  return (
    <MobilePage inset={false}>
      <MobileHeader title="Settings" inset={false} />
      <div className="flex flex-col gap-6 px-4 py-4">
        {/* Identity — one honest block, not a fake name. */}
        <div className="flex items-center gap-3 rounded-lg border-2 border-foreground bg-card p-4 hard-shadow-sm">
          <div
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-primary font-mono text-lg font-black text-primary-foreground"
          >
            {(email?.[0] ?? "S").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-semibold text-foreground">{email ?? "Signed in"}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-caption text-muted-foreground">
              <span className="capitalize">{role}</span>
              <span aria-hidden>·</span>
              {BRAND.shortName}
            </p>
          </div>
          <StatusPill tone="neutral" label="Signed in" />
        </div>

        {/* Account — what the app actually knows. */}
        <MobileSection title="Account" description="Your sign-in and role on the programme.">
          <MobileListItem
            leading={<User className="size-4 text-foreground" aria-hidden />}
            title="Email address"
            subtitle={email ?? "—"}
          />
          <MobileListItem
            leading={<Shield className="size-4 text-foreground" aria-hidden />}
            title="Role"
            subtitle={<span className="capitalize">{role}</span>}
          />
        </MobileSection>

        {/* Shortcuts — quick jumps, kept honest (they don't change settings). */}
        <MobileSection title="Shortcuts" description="Quick jumps around the programme.">
          <MobileListItem
            href="/practice/modules"
            leading={<span className="font-mono text-xs font-black text-link">01</span>}
            title="Course modules"
            subtitle="Browse the curriculum — locked ones say why."
          />
          <MobileListItem
            href="/notifications"
            leading={<Bell className="size-4 text-foreground" aria-hidden />}
            title="Notifications"
            subtitle="Replies to your wall posts, and anything needing review."
          />
          <MobileListItem
            href="/wall"
            leading={<MessageSquare className="size-4 text-foreground" aria-hidden />}
            title="Cohort wall"
            subtitle="Posts, replies and reactions from your cohort."
          />
        </MobileSection>

        <div className="border-t-2 border-border pt-4">
          <form action={logout}>
            <Button type="submit" variant="outline" size="lg" className="w-full">
              <LogOut className="size-4" aria-hidden />
              Log out
            </Button>
          </form>
          <p className="mt-2 text-center text-caption text-muted-foreground">
            Signing out keeps your progress — just sign back in.
          </p>
        </div>
      </div>
    </MobilePage>
  );
}
