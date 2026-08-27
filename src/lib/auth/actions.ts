"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { rateLimitFast } from "@/lib/rate-limit-fast";

export type LoginState = { error: string | null };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // Rate limit login attempts per email (brute-force protection). The key is
  // LOWERCASED — Supabase matches email case-insensitively, so a case-sprayed
  // variant (`Admin@x.com`, `ADMIN@x.com`) used to mint its own fresh bucket
  // against the same account, defeating the cap.
  if (!(await rateLimit(`login:${email.toLowerCase()}`, 10))) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  // Per-IP limiter in parallel — the per-email cap alone is bypassable from a
  // botnet of addresses against many accounts. In-process and generous; it's a
  // coarse abuse throttle, not a hard boundary.
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!rateLimitFast(`login:ip:${ip}`, 60)) {
    return { error: "Too many attempts from this network. Try again in a minute." };
  }

  // Cloudflare Turnstile verification (only when a secret key is configured).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = String(formData.get("cf-turnstile-response") ?? "");
    if (!token) return { error: "Please complete the human check." };
    try {
      const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: token,
          }),
        },
      );
      const json = (await res.json()) as { success?: boolean };
      if (!json.success) return { error: "Human check failed. Try again." };
    } catch {
      // Fail closed if verification can't be reached.
      return { error: "Could not verify the human check. Try again." };
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  // Check expiry before handing out a session, not just after.
  const { data: profile } = await supabase
    .from("profiles")
    .select("expires_at, role")
    .eq("id", data.user.id)
    .single();

  // Alumni keep permanent read-only access (A10) — expiry only gates students.
  if (profile?.expires_at && profile.role !== "alumni" && new Date(profile.expires_at).getTime() <= new Date().getTime()) {
    await supabase.auth.signOut();
    return { error: "This account's access has expired." };
  }

  // Concurrent-session blocking: overwrite the token unconditionally. Any
  // browser holding the previous token gets logged out the next time
  // getSession() runs there (see src/lib/auth/session.ts).
  const sessionToken = crypto.randomUUID();

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ active_session_token: sessionToken })
    .eq("id", data.user.id);

  if (updateError) {
    return { error: "Something went wrong signing you in. Try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days — expires_at is the real gate, not this
  });

  // /dashboard is the front door — the single course view (or course grid).
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Clear the DB-side token too, so the cookie we're about to delete
    // couldn't be replayed even if someone kept a copy of it.
    await supabase.from("profiles").update({ active_session_token: null }).eq("id", user.id);
  }

  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  redirect("/login");
}
