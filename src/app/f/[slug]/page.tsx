import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { createAdminClient } from "@/lib/supabase/server";
import { loadFormBySlug } from "@/lib/forms/load";
import { Rule } from "@/components/landing/landing-primitives";
import { PublicForm } from "./public-form";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const form = await loadFormBySlug(createAdminClient(), slug);
  return { title: form?.title ?? "Form", robots: { index: false, follow: false } };
}

/**
 * /f/[slug]: a public link form. Only the title, description and questions
 * reach the browser; answers are saved by the server action.
 */
export default async function PublicFormPage({ params }: Props) {
  const { slug } = await params;
  const form = await loadFormBySlug(createAdminClient(), slug);
  if (!form) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-14">
        <p className="font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{BRAND.name}</p>
        <div className="mt-4 rounded-[10px] border-2 border-foreground bg-card p-5 hard-shadow-md sm:p-8">
          <h1 className="text-h1 break-words">{form.title}</h1>
          {form.description ? <p className="mt-3 whitespace-pre-wrap break-words text-muted-foreground">{form.description}</p> : null}
          <Rule className="mt-5 mb-6" />
          {form.isActive ? (
            <PublicForm slug={form.slug} fields={form.fields} />
          ) : (
            <div role="status" className="py-4 text-center">
              <p className="text-xl font-bold">This form is closed.</p>
              <p className="mt-3 text-small text-muted-foreground">It is not taking answers any more. Thank you for your interest.</p>
            </div>
          )}
        </div>
        <p className="mt-6 text-caption text-muted-foreground">
          Your answers go only to the {BRAND.shortName} team. See our{" "}
          <Link href="/policies/privacy" className="text-link underline underline-offset-4">privacy policy</Link>.
        </p>
      </main>
    </div>
  );
}
