import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
function loadEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  try {
    if (!existsSync(".env.local")) return undefined;
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(new RegExp(`^${name}=(.*)$`));
      if (m) return m[1].trim();
    }
  } catch {}
  return undefined;
}
const url = loadEnv("NEXT_PUBLIC_SUPABASE_URL")!;
const key = loadEnv("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(url, key, { auth: { persistSession: false } });
const EMAIL = "peer@vibha.test";
const PASS = "K#test";
async function main() {
  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing?.users.find((u) => u.email === EMAIL);
  let userId = found?.id;
  if (!found) {
    const { data, error } = await admin.auth.admin.createUser({ email: EMAIL, password: PASS, email_confirm: true });
    if (error) throw error;
    userId = data.user.id;
  }
  const { data: prof } = await admin.from("profiles").upsert({
    id: userId, email: EMAIL, role: "student", is_test: true,
  }, { onConflict: "id" });
  console.log("peer user ready:", userId, "profiles error:", prof ? "none" : "n/a");
}
main().catch((e) => { console.error(e); process.exit(1); });
