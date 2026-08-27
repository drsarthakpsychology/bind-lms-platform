import "server-only";

/**
 * Ready-made email templates for the /admin/emails compose tab.
 *
 * Every template is a full email-client-safe HTML document (tables + inline
 * styles ONLY — no <style> blocks, no scripts; email clients strip or ignore
 * both) with a plain-text fallback. The shell carries the Neo-Brutalist brand:
 * cream backdrop, 2px ink borders, peach accent, terracotta links.
 *
 * The credential email is NOT here — it lives in `src/lib/auth/roster.ts`
 * (`credentialsEmailHtml`) because it carries a per-student password and is
 * sent from the Credentials tab, not the compose picker.
 */

export type EmailTemplateBuildParams = {
  name?: string;
  detail?: string;
  appUrl?: string;
};

export type EmailTemplate = {
  id: string;
  label: string;
  defaultSubject: string;
  hint: string;
  build: (params?: EmailTemplateBuildParams) => { subject: string; html: string; text: string };
};

const BRAND = {
  bg: "#FFF9F0",
  card: "#ffffff",
  ink: "#1a1a1a",
  muted: "#5c554a",
  peach: "#F4A261",
  link: "#b83a00",
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Wrap content in a full email document — 600px card on cream, inline styles only. */
export function emailShell(title: string, contentHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:${BRAND.card};border:2px solid ${BRAND.ink};border-radius:10px;padding:32px;">
      ${contentHtml}
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}

/** The shared text/HTML footer so every template ends on the same note. */
function footerHtml(): string {
  return `<p style="margin:24px 0 0;padding-top:16px;border-top:2px solid ${BRAND.ink};font-size:13px;line-height:1.5;color:${BRAND.muted};">With care,<br/>The VIBHA School of Psychology team</p>`;
}
function footerText(): string {
  return "\n\n— The VIBHA School of Psychology team";
}

export const welcomeTemplate: EmailTemplate = {
  id: "welcome",
  label: "Welcome / Onboarding",
  defaultSubject: "Welcome to VIBHA School of Psychology",
  hint: "The first email a new student receives after joining.",
  build: (params = {}) => {
    const name = params.name ? `, ${esc(params.name)}` : "";
    const appUrl = params.appUrl ?? "https://vibhapsychology.com";
    const html = emailShell(
      "Welcome to VIBHA",
      `
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:${BRAND.ink};">Welcome${name}!</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.ink};">We're glad you're here. Your journey through the world of clinical psychology begins now — one lesson, one practice session, one honest check-in at a time.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td align="center" style="padding:8px 0 20px;">
          <a href="${appUrl}/login" style="display:inline-block;background:${BRAND.peach};color:${BRAND.ink};font-size:15px;font-weight:700;text-decoration:none;padding:12px 24px;border:2px solid ${BRAND.ink};border-radius:6px;">Start your first lesson</a>
        </td>
      </tr></table>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${BRAND.ink};">${params.detail ? `${esc(params.detail)}<br/><br/>` : ""}If you have any questions, just reply to this email or reach out to the programme team.</p>
      ${footerHtml()}
      `,
    );
    const text = `Welcome${name}!\n\nWe're glad you're here. Your journey through the world of clinical psychology begins now.\n\nSign in at ${appUrl}/login to start your first lesson.${params.detail ? `\n\n${params.detail}` : ""}${footerText()}`;
    return { subject: welcomeTemplate.defaultSubject, html, text };
  },
};

export const announcementTemplate: EmailTemplate = {
  id: "announcement",
  label: "Announcement",
  defaultSubject: "A note from VIBHA School of Psychology",
  hint: "A general note to your students — edit the body freely.",
  build: (params = {}) => {
    const appUrl = params.appUrl ?? "https://vibhapsychology.com";
    const html = emailShell(
      "A note from VIBHA",
      `
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:${BRAND.ink};">${esc(params.detail?.split("\n")[0] ?? "A note from VIBHA")}</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.ink};white-space:pre-line;">${esc(params.detail ?? "Your message here.")}</p>
      <p style="margin:20px 0 0;font-size:14px;line-height:1.5;color:${BRAND.ink};"><a href="${appUrl}/login" style="color:${BRAND.link};font-weight:700;text-decoration:underline;">Sign in</a></p>
      ${footerHtml()}
      `,
    );
    const text = `${params.detail ?? "Your message here."}\n\nSign in at ${appUrl}/login${footerText()}`;
    return { subject: announcementTemplate.defaultSubject, html, text };
  },
};

/** All pickable compose templates (credentials are sent from the Credentials tab). */
export const EMAIL_TEMPLATES: EmailTemplate[] = [welcomeTemplate, announcementTemplate];

export function getEmailTemplate(id: string | null | undefined): EmailTemplate | null {
  if (!id) return null;
  return EMAIL_TEMPLATES.find((t) => t.id === id) ?? null;
}
