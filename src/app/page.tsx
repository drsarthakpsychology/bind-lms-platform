import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getSession();
  redirect(session.status === "ok" ? "/dashboard" : "/login");
}
