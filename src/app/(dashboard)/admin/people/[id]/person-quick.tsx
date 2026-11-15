"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { Person } from "@/lib/crm/people";
import { waLink, waMessage } from "@/lib/crm/views";
import { cn } from "@/lib/utils";
import { btn } from "../../_v2/kit";
import { EmailCompose, type Allowance } from "../../forms/email-compose";
import { emailPeople, logWhatsApp } from "../actions";
import { QuickActions } from "../pipeline-v2";

/** The person record's header: email (with merge fields and the daily allowance), WhatsApp, call, and the rest in one menu. */
export function PersonQuick({ p, canWrite, paymentReady, allowance }: { p: Person; canWrite: boolean; paymentReady: boolean; allowance: Allowance }) {
  const router = useRouter();
  const [compose, setCompose] = React.useState(false);
  const wa = waLink(p.phone, waMessage("Hi {first_name}, ", p));
  return (
    <>
      {canWrite ? (
        <button type="button" className={btn.quiet} onClick={() => setCompose(true)}>
          <Mail aria-hidden /> Email
        </button>
      ) : null}
      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.quiet} onClick={() => canWrite && void logWhatsApp([p.email], "Opened WhatsApp")}>
          <MessageCircle aria-hidden /> WhatsApp
        </a>
      ) : (
        <span aria-disabled className={cn(btn.quiet, "opacity-45")}>
          <MessageCircle aria-hidden /> WhatsApp
        </span>
      )}
      {p.phone ? (
        <a href={`tel:${p.phone.replace(/[^\d+]/g, "")}`} className={btn.quiet}>
          <Phone aria-hidden /> Call
        </a>
      ) : null}
      <QuickActions p={p} canWrite={canWrite} paymentReady={paymentReady} onEmail={() => setCompose(true)} hideContact />
      {compose ? (
        <EmailCompose
          open
          onOpenChange={(o) => {
            if (!o) {
              setCompose(false);
              router.refresh();
            }
          }}
          title={`Email ${p.name}`}
          recipients={[{ key: p.email, name: p.name, email: p.email }]}
          allowance={allowance}
          onSend={(subject, body) => emailPeople({ emails: [p.email], subject, body })}
        />
      ) : null}
    </>
  );
}
