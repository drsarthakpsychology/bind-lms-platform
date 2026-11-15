import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { loadNavAccess } from "@/lib/ui/access";
import { createClient } from "@/lib/supabase/server";
import { LEGAL } from "@/lib/legal-constants";
import { ME_GROUPS, visibleGroups } from "@/components/navigation/v2-config";
import { PageFrame, Row, RowList, Section } from "@/components/ds";
import { HubGroups } from "@/components/ds/hub";
import { MeAccountRows, MeDisplayRows } from "./me-controls";

export const metadata: Metadata = { title: "Me" };

/**
 * Me (new design): who you are, your work, help and your account, as plain
 * rows. Replaces the phone account sheet and the More drawer.
 */
export default async function MePage() {
  const nav = await loadNavAccess();
  if (!nav) return null;
  const { profile, access, preview } = nav;
  const supabase = await createClient();
  const { data: me } = await supabase.from("profiles").select("name").eq("id", profile.id).maybeSingle();
  const name = (me?.name as string | null | undefined)?.trim() || null;
  const groups = visibleGroups(ME_GROUPS, access);
  const whatsapp = `https://wa.me/${LEGAL.phone.replace(/[^\d]/g, "")}`;
  const roleWord = preview ? "Admin, seeing the student side" : profile.role === "alumni" ? "Alumni" : profile.role === "student" ? "Student" : "Admin";

  return (
    <PageFrame>
      <header className="flex min-w-0 items-center gap-4">
        <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full bg-brand type-h2 text-brand-foreground">
          {((name ?? profile.email ?? "V").trim()[0] ?? "V").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="type-h2 [overflow-wrap:anywhere]">{name ?? "Me"}</h1>
          {profile.email ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{profile.email}</p> : null}
          <p className="type-caption text-muted-foreground">
            {roleWord}
            {profile.roll_number ? <> · <span className="type-num">{profile.roll_number}</span></> : null}
          </p>
        </div>
      </header>

      <HubGroups groups={groups} />

      <Section id="contact" title="Need a hand?">
        <RowList>
          <Row href={whatsapp} external icon={<MessageCircle />} title="Message us on WhatsApp" meta="Login, video or payment trouble" />
        </RowList>
      </Section>

      <Section id="display" title="Display">
        <MeDisplayRows student={profile.role === "student"} />
      </Section>

      <Section id="account" title="Account">
        <MeAccountRows preview={preview} />
      </Section>
    </PageFrame>
  );
}
