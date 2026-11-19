import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML/CSS/JS to ./out,
// which is what GitHub Pages serves.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
