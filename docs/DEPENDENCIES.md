# Dependencies

Every direct dependency in `package.json`, why it is there and where it is used. Usage was checked by searching imports on 2026-11-14. "Unused" means no import in `src`, `scripts`, `livekit-agent` or `e2e`. Removal is for the cleanup agent and the owner to decide (`docs/REMOVAL_REGISTER.md`).

## Runtime dependencies

| Package | Why | Used in |
|---|---|---|
| `next` | The framework (App Router, Server Actions, route handlers) | Everywhere |
| `react`, `react-dom` | UI | Everywhere |
| `@supabase/supabase-js` | Database, auth and storage client | `src/lib/supabase/*`, many scripts |
| `@supabase/ssr` | Supabase auth cookies in Next.js | `src/proxy.ts`, `src/lib/supabase/server.ts`, `client.ts` |
| `server-only` | Build error if a server module is imported in the browser | About 100 files (`import "server-only"`) |
| `zod` | Input checks on every API route and many actions | 68 files |
| `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` | Cloudflare R2 through its S3 API; presigned upload and download URLs | `src/lib/media/r2.ts`, `src/lib/achievements/storage.ts`, scripts |
| `hls.js` | HLS lecture playback with AES-128 | `courses/[courseId]/lessons/[lessonId]/video-player.tsx` |
| `pdf-lib` | Makes certificate and Skills Passport PDFs | `src/lib/certificate.ts`, `src/lib/passport-pdf.ts`, `src/lib/achievements/pdf.ts` |
| `qrcode` | QR code on certificates | `src/lib/certificate.ts`, `src/lib/achievements/pdf.ts` |
| `pdfjs-dist` | Shows course PDFs in the browser | `courses/[courseId]/materials/[materialId]/viewer.tsx` |
| `csv-parse` | Roster CSV import | `src/lib/auth/roster.ts` |
| `gray-matter`, `next-mdx-remote`, `remark-gfm` | Policy pages written in Markdown | `src/lib/policies.ts`, `src/app/policies/[slug]/page.tsx` |
| `ts-fsrs` | Spaced repetition schedule for review cards | `src/lib/practice/rounds.ts` |
| `radix-ui` | Accessible base parts (dialog, popover, tabs, tooltip) | `src/components/ui/*` |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Component variants and class merging | `src/components/ui/*`, `src/lib/utils.ts` |
| `lucide-react` | Icons | About 300 files |
| `motion` | Animation | 17 files (landing, home, study scenes) |
| `sonner` | Toast messages | 12 files |
| `next-themes` | Light and dark theme | `src/components/theme-provider.tsx`, `ui/sonner.tsx`, account menu |
| `tw-animate-css` | Tailwind animation classes | `src/app/globals.css` |
| `roughjs` | Hand-drawn diagram style | `src/components/sketch/ink.tsx` |
| `three`, `@react-three/fiber`, `@react-three/drei` | 3D study scenes | `src/components/study/scenes/*` (about 8 files) |
| `react-hook-form` | Form state for the shared form component | `src/components/ui/form.tsx` |
| `@sentry/nextjs` | Error reports (inactive until a DSN is set) | `sentry.*.config.ts`, `src/instrumentation*.ts`, error pages, `next.config.ts` |
| `posthog-js` | Product analytics (inactive until a key is set), loaded lazily | `src/lib/analytics.ts` |
| `@vercel/analytics`, `@vercel/speed-insights` | Vercel traffic and real-user speed numbers | `src/app/layout.tsx` |
| `livekit-client` | Browser side of the realtime voice room | `src/lib/voice/use-livekit-session.ts` |
| `livekit-server-sdk` | Makes LiveKit room tokens | `src/lib/livekit/token.ts` |
| `@livekit/agents` | The separate voice worker | `livekit-agent/` only (not the web app) |
| `@huggingface/transformers` | Local text embeddings for the knowledge layer (dynamic import) | `src/lib/knowledge/embed-local.ts`, `scripts/knowledge/*`. Large; only loaded when the knowledge tutor runs |
| `pg` | Direct Postgres connection for scripts | `scripts/apply-pending.ts`, `apply-migrations.ts`, `restore.ts` and others. Not used by the web app |
| `adm-zip` | Reads zip files in one script | 1 script under `scripts/`. Not used by the web app |
| `@hookform/resolvers` | Joins zod to react-hook-form | **Unused** (no import found) |

Scripts-only packages (`pg`, `adm-zip`, `@livekit/agents`) could move to `devDependencies`. That would not change the web bundle, because Next only bundles what pages import.

## Development dependencies

| Package | Why |
|---|---|
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three`, `@types/qrcode`, `@types/adm-zip` | Types |
| `eslint`, `eslint-config-next`, `eslint-config-prettier` | Lint (`npm run lint`) |
| `prettier`, `prettier-plugin-tailwindcss` | Formatting |
| `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/forms` | Tailwind v4 build |
| `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` | Unit and component tests |
| `@playwright/test` | End-to-end tests (`e2e/`) |
| `tsx` | Runs the TypeScript scripts in `scripts/` |
| `knip` | Finds unused files and exports (`npm run knip`) |

## Overrides

`package.json` `overrides` pin safe versions of `sharp`, `dompurify`, `source-map-js`, `fast-uri`, `brace-expansion@5`, and the nested `adm-zip`, `js-yaml` and `fast-copy` used by `onnxruntime-node`, `gray-matter` and `@livekit/rtc-node`. They close npm audit advisories. Remaining moderate advisories wait for a `@livekit/agents` and Sentry upgrade (`docs/security/SECURITY_AUDIT_2026_11.md`).

## Python and other runtimes

`scripts/chatterbox-server/` holds a small Python text to speech server (`npm run chatterbox:server`, needs `uvicorn`). It is not deployed with the app.
