// SVG -> PNG for the files drawn by make-assets.py. Uses sharp from the website's
// node_modules (not a dependency of the app): run from the repo with
//   node apps/mobile/scripts/make-assets.mjs
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../../package.json"));
const sharp = require("sharp");
const brand = join(here, "../assets/brand");
const images = join(here, "../assets/images");
const jobs = [
  ["icon.svg", "icon.png", 1024],
  ["adaptive-foreground.svg", "adaptive-foreground.png", 1024],
  ["adaptive-monochrome.svg", "adaptive-monochrome.png", 1024],
  ["notification.svg", "notification.png", 96],
  ["splash.svg", "splash.png", 1024],
  ["splash-dark.svg", "splash-dark.png", 1024],
  ["favicon.svg", "favicon.png", 96],
];
for (const [src, out, size] of jobs) {
  await sharp(join(brand, src), { density: 144 }).resize(size, size).png().toFile(join(images, out));
  console.log(out);
}
