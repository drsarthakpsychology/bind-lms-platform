import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getSession();

  if (session.status === "ok") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">PLMS</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Invite-only. Use the credentials your administrator sent you.
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
