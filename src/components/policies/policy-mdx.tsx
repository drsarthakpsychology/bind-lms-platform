import { cn } from "@/lib/utils";
import { headingSlug } from "@/lib/policies";

/**
 * The shared rendering rules for legal copy. Clause headings (h2/h3) get the
 * anchor id the brief's deep-links rely on (`/policies/refund#2-3-...`); every
 * table lives in an overflow-x container so no policy ever breaks a mobile
 * layout. All text uses the site's token scale (text-body = 16px/1.6) — legal
 * copy is a reading surface, not decoration.
 *
 * Deliberately NOT "use client": these render server-side with MDXRemote (RSC).
 */

function PolicyHeading({
  level,
  children,
}: {
  level: 2 | 3;
  children?: React.ReactNode;
}) {
  const text = String(children ?? "").trim();
  const id = headingSlug(text);
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={cn(
        "group scroll-mt-28 font-semibold text-foreground",
        level === 2 ? "mt-10 text-h2 first:mt-0" : "mt-8 text-h3",
      )}
    >
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to this section: ${text}`}
        className="ml-2 text-link opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}

export const policyMdxComponents = {
  h2: (props: { children?: React.ReactNode }) => (
    <PolicyHeading level={2} {...props} />
  ),
  h3: (props: { children?: React.ReactNode }) => (
    <PolicyHeading level={3} {...props} />
  ),
  p: (props: { children?: React.ReactNode }) => (
    <p className="my-3 text-body leading-relaxed text-foreground" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-link underline underline-offset-4 transition-colors hover:text-foreground"
      {...props}
    />
  ),
  strong: (props: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: { children?: React.ReactNode }) => <em className="italic" {...props} />,
  ul: (props: { children?: React.ReactNode }) => (
    <ul className="my-3 list-disc space-y-1.5 pl-6" {...props} />
  ),
  ol: (props: { children?: React.ReactNode }) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-6" {...props} />
  ),
  li: (props: { children?: React.ReactNode }) => (
    <li className="text-body leading-relaxed text-foreground" {...props} />
  ),
  blockquote: (props: { children?: React.ReactNode }) => (
    <blockquote
      className="my-4 border-l-2 border-link pl-4 text-body italic text-foreground"
      {...props}
    />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-5 overflow-x-auto overscroll-x-contain" role="region" aria-label="Policy table — scroll horizontally if needed">
      <table
        className="w-full min-w-[18rem] border-collapse text-small"
        {...props}
      />
    </div>
  ),
  thead: (props: { children?: React.ReactNode }) => (
    <thead className="bg-surface-2 text-left" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border px-3 py-2 align-top font-semibold text-foreground"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-3 py-2 align-top text-foreground" {...props} />
  ),
  // Zebra rows so long reference tables stay scannable (hairline, never cramped).
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="odd:bg-surface-2/50" {...props} />
  ),
  hr: () => <hr className="my-8 border-foreground/20" />,
} as const;
