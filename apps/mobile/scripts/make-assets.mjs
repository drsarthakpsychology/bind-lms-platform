// SVG -> PNG for the files drawn by make-assets.py. Uses sharp from the website's
// node_modules (not a dependency of the app): run from the repo with
//   python3 apps/mobile/scripts/make-assets.py && node apps/mobile/scripts/make-assets.mjs
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../../package.json"));
const sharp = require("sharp");
const brand = join(here, "../assets/brand");
const images = join(here, "../assets/images");
const store = join(here, "../docs/release/store-assets");
mkdirSync(store, { recursive: true });
// [svg, output folder, file, width, height, opaque]
const jobs = [
  ["icon.svg", images, "icon.png", 1024, 1024, true],
  ["adaptive-foreground.svg", images, "adaptive-foreground.png", 1024, 1024, false],
  ["adaptive-background.svg", images, "adaptive-background.png", 1024, 1024, true],
  ["adaptive-monochrome.svg", images, "adaptive-monochrome.png", 1024, 1024, false],
  ["notification.svg", images, "notification.png", 96, 96, false],
  ["splash.svg", images, "splash.png", 1024, 1024, false],
  ["favicon.svg", images, "favicon.png", 96, 96, true],
  // Google Play listing: 512 x 512 icon and the 1024 x 500 feature graphic.
  ["icon.svg", store, "play-icon-512.png", 512, 512, true],
  ["feature-graphic.svg", store, "feature-graphic-1024x500.png", 1024, 500, true],
];
for (const [src, dir, out, w, h, opaque] of jobs) {
  let img = sharp(join(brand, src), { density: 144 }).resize(w, h);
  if (opaque) img = img.flatten({ background: "#1d44d8" }).removeAlpha();
  await img.png().toFile(join(dir, out));
  console.log(out);
}
