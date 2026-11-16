import * as React from "react";
import { View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { toQR } from "toqr";

import { fixed } from "@/theme";

/**
 * The QR grid for a text: a list of rows of 0 and 1 (toqr, error correction
 * M, so a slightly blurry phone photo of a projector still reads).
 */
export function qrGrid(text: string): number[][] {
  if (!text) return [];
  try {
    const flat = toQR(text);
    const n = Math.round(Math.sqrt(flat.length));
    if (!n || n * n !== flat.length) return [];
    return Array.from({ length: n }, (_, y) => Array.from(flat.subarray(y * n, y * n + n)));
  } catch {
    return [];
  }
}

/** One path for every dark square: a single SVG node, however big the code. */
export function qrPath(grid: number[][], quiet = 4): string {
  let d = "";
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w]) w++;
      d += `M${x + quiet} ${y + quiet}h${w}v1h${-w}z`;
      x += w;
    }
  });
  return d;
}

/**
 * The attendance QR: always black on white with a white quiet zone (cameras
 * read dark on light best, in either theme). Square, `size` points wide.
 */
export function QrCode({ text, size, testID }: { text: string; size: number; testID?: string }) {
  const grid = React.useMemo(() => qrGrid(text), [text]);
  const quiet = 4;
  const n = grid.length + quiet * 2;
  const d = React.useMemo(() => qrPath(grid, quiet), [grid]);
  return (
    <View testID={testID} accessible accessibilityRole="image" accessibilityLabel="Attendance code. Students scan this with the VIBHA app." style={{ width: size, height: size, backgroundColor: fixed.white, borderRadius: 12, overflow: "hidden" }}>
      {grid.length ? (
        <Svg width={size} height={size} viewBox={`0 0 ${n} ${n}`}>
          <Rect x={0} y={0} width={n} height={n} fill={fixed.white} />
          <Path d={d} fill={fixed.ink} />
        </Svg>
      ) : null}
    </View>
  );
}
