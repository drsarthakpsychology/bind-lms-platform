import * as React from "react";
import type { Layout } from "./layout";

/**
 * Draw a certificate layout as SVG: the on-screen twin of pdf.ts. No hooks,
 * so it renders on the server (student and verify pages) and in the browser
 * (the admin studio's live preview). `images` maps signature keys to URLs.
 */
export function CertificateSvg({ layout, images, className, label }: { layout: Layout; images?: Record<string, string | null | undefined>; className?: string; label?: string }) {
  return (
    <svg
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      className={className}
      role="img"
      aria-label={label ?? layout.title}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "auto", aspectRatio: `${layout.w} / ${layout.h}` }}
    >
      {layout.ops.map((op, i) => {
        switch (op.k) {
          case "rect":
            return <rect key={i} x={op.x} y={op.y} width={op.w} height={op.h} fill={op.fill ?? "none"} stroke={op.stroke} strokeWidth={op.sw} />;
          case "line":
            return <line key={i} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={op.stroke} strokeWidth={op.sw} />;
          case "stroke":
            return <path key={i} d={op.d} fill="none" stroke={op.stroke} strokeWidth={op.sw} strokeLinecap="round" strokeLinejoin="round" />;
          case "path":
            return <path key={i} d={op.d} fill={op.fill} />;
          case "image": {
            const src = images?.[op.key];
            // eslint-disable-next-line @next/next/no-img-element -- inside SVG; next/image does not apply
            return src ? <image key={i} href={src} x={op.x} y={op.y} width={op.w} height={op.h} preserveAspectRatio="xMinYMax meet" /> : null;
          }
          default:
            return null;
        }
      })}
    </svg>
  );
}
