import { NextResponse } from "next/server";

/**
 * RFC 9728 OAuth Protected Resource Metadata — tells agents which
 * authorization server guards the site's authenticated APIs. The AS is
 * Supabase Auth (the app uses Supabase session JWTs); Supabase publishes its
 * own OIDC discovery at the auth base. The resource itself (the site) is
 * declared here.
 */
const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const metadata = {
  resource: baseUrl,
  authorization_servers: supabaseUrl ? [`${supabaseUrl}/auth/v1`] : [],
  scopes_supported: [],
  bearer_methods_supported: ["header"],
};

export function GET() {
  return NextResponse.json(metadata, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
