/** The message an admin pastes into WhatsApp: who they sign in as, and the one-time link. */
export function loginDetailsText(name: string, email: string, setupUrl: string, origin: string): string {
  const first = name.trim().split(/\s+/)[0] || "there";
  return `Hi ${first}, here are your VIBHA login details.\n\nEmail: ${email}\nSet your password (the link works once, for 3 days):\n${setupUrl}\n\nThen sign in at ${origin.replace(/\/$/, "")}/login`;
}
