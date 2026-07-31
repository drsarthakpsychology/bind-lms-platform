"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { VIEW_MODE_COOKIE } from "./view-mode-constants";

export async function setViewMode(mode: "admin" | "student"): Promise<void> {
  // Only meaningful for admins — a student flipping this wouldn't do
  // anything anyway since the admin section re-checks role independently,
  // but no reason to let a non-admin write the cookie at all.
  if (!(await requireAdmin())) return;

  const cookieStore = await cookies();
  if (mode === "student") {
    cookieStore.set(VIEW_MODE_COOKIE, "student", { path: "/", maxAge: 60 * 60 * 24 });
  } else {
    cookieStore.delete(VIEW_MODE_COOKIE);
  }

  redirect(mode === "student" ? "/dashboard" : "/admin");
}
