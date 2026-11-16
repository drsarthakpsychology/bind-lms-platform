import * as React from "react";
import { View } from "react-native";
import Svg, { Image as SvgImage, Line, Path, Rect } from "react-native-svg";

import { Skeleton, T } from "@/ds";
import { finite, safePath } from "@/lib/svg-safe";
import { Reveal } from "@/motion";
import { layout, space, useTheme } from "@/theme";
import type { Drawing } from "./safe";

/**
 * The certificate exactly as the student gets it: the server's own layout
 * (POST /admin/certificates/preview) drawn with react-native-svg, the same
 * operations the website draws and prints. Letters arrive as filled paths,
 * so no fonts are needed on the phone.
 */
export function CertDrawing({ drawing, label }: { drawing: Drawing; label: string }) {
  const c = useTheme();
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} testID="cert-drawing" style={{ borderRadius: layout.radius, overflow: "hidden", borderWidth: 1, borderColor: c.hairline, backgroundColor: c.paper, aspectRatio: finite(drawing.width, 842) / Math.max(1, finite(drawing.height, 595)) }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${drawing.width} ${drawing.height}`} preserveAspectRatio="xMidYMid meet">
        {drawing.ops.map((op, i) => {
          switch (op.k) {
            case "rect":
              return <Rect key={i} x={op.x} y={op.y} width={op.w} height={op.h} fill={op.fill ?? "none"} stroke={op.stroke ?? undefined} strokeWidth={op.sw || undefined} />;
            case "line":
              return <Line key={i} x1={op.x1} y1={op.y1} x2={op.x2} y2={op.y2} stroke={op.stroke} strokeWidth={op.sw} />;
            case "stroke":
              return <Path key={i} d={safePath(op.d)} fill="none" stroke={op.stroke} strokeWidth={finite(op.sw, 1)} strokeLinecap="round" strokeLinejoin="round" />;
            case "path":
              return <Path key={i} d={safePath(op.d)} fill={op.fill} />;
            case "image": {
              const src = drawing.images[op.key];
              return src ? <SvgImage key={i} href={{ uri: src }} x={op.x} y={op.y} width={op.w} height={op.h} preserveAspectRatio="xMinYMax meet" /> : null;
            }
            default:
              return null;
          }
        })}
      </Svg>
    </View>
  );
}

/** The drawing while it loads (a page-shaped skeleton), then the drawing settling in, then what still stops it being issued. */
export function CertPreviewBlock({ drawing, loading, label }: { drawing: Drawing | undefined; loading: boolean; label: string }) {
  if (!drawing) {
    return loading ? (
      <View style={{ width: "100%", aspectRatio: 842 / 595 }} testID="cert-drawing-loading">
        <Skeleton r={layout.radius} style={{ height: "100%" }} />
      </View>
    ) : null;
  }
  return (
    <Reveal key={drawing.ops.length ? "on" : "off"} style={{ gap: space[3], opacity: loading ? 0.6 : 1 }}>
      <CertDrawing drawing={drawing} label={label} />
      {drawing.problems.length ? (
        <View style={{ gap: space[1] }} testID="cert-problems" accessibilityLiveRegion="polite">
          {drawing.problems.map((p) => (
            <T key={p} v="small" tone="danger">
              {p}
            </T>
          ))}
        </View>
      ) : null}
    </Reveal>
  );
}
