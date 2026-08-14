import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PageViewTracker } from "@/components/analytics/page-view";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhaschoolofpsychology.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.shortName}`,
  },
  description: BRAND.description,
  // The public site (/, /enquire) is indexable. The LMS routes opt out in the
  // (dashboard) layout; /login, /expired and /verify opt out individually.
  robots: { index: true, follow: true },
  openGraph: {
    title: BRAND.name,
    description: BRAND.description,
    url: siteUrl,
    siteName: BRAND.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: BRAND.name,
    description: BRAND.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster />
          {/* Vercel Web Analytics (traffic stats) + Speed Insights (real-user
              Core Web Vitals). No-op when the deployment's plan/feature isn't
              enabled — they auto-detect the Vercel deployment. This is the
              zero-key stats + performance-tracking layer; PostHog adds
              event-level funnel tracking on top (see @/lib/analytics). */}
          <Analytics />
          <SpeedInsights />
          {/* PostHog pageview tracking on route change. useSearchParams needs
              a Suspense boundary to prerender statically. No-op without a
              NEXT_PUBLIC_POSTHOG_KEY. */}
          <Suspense>
            <PageViewTracker />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
