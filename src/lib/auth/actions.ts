"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";

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

  // Rate limit login attempts per email (brute-force protection).
  if (!(await rateLimit(`login:${email}`, 10))) {
    return { error: "Too many attempts. Try again in a minute." };
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

  // /today is the front door (v5.1 Part B); /dashboard stays for courses.
  redirect("/today");
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
