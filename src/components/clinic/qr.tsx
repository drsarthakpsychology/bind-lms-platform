import QRCode from "qrcode";

/**
 * A QR code drawn as one SVG path (crisp at any size, prints and projects
 * well). The matrix comes from the `qrcode` package's pure encoder, so this
 * works the same on the server and in the browser.
 */

/** The QR matrix as an SVG path in module units, plus its size (without the quiet zone). */
export function qrPath(value: string): { d: string; size: number } {
  const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const data = qr.modules.data;
  let d = "";
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!data[y * size + x]) {
        x++;
        continue;
      }
      // One horizontal run per row keeps the path short.
      const start = x;
      while (x < size && data[y * size + x]) x++;
      d += `M${start} ${y}h${x - start}v1h${start - x}z`;
    }
  }
  return { d, size };
}

/** Ink on white always (scanners need the contrast, also in dark mode), with a 4-module quiet zone. */
export function QrSvg({ value, label, className }: { value: string; label: string; className?: string }) {
  const { d, size } = qrPath(value);
  const q = 4;
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${-q} ${-q} ${size + q * 2} ${size + q * 2}`}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect x={-q} y={-q} width={size + q * 2} height={size + q * 2} fill="#ffffff" />
      <path d={d} fill="#111111" />
    </svg>
  );
}
