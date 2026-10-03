import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const html = await fs.readFile(".next/server/app/index.html", "utf8");
const scripts = [
  ...new Set(
    [...html.matchAll(/src="\/_next\/(static\/[^" ]+\.js)"/g)].map((m) => m[1]),
  ),
];
const initial = [];
for (const file of scripts) {
  const bytes = await fs.readFile(path.join(".next", file));
  initial.push({
    file,
    bytes: bytes.length,
    gzipBytes: gzipSync(bytes).length,
  });
}
const lazy = [];
for (const name of await fs.readdir(".next/static/chunks")) {
  if (!name.endsWith(".js")) continue;
  const file = `static/chunks/${name}`;
  if (scripts.includes(file)) continue;
  const bytes = await fs.readFile(path.join(".next", file));
  if (bytes.includes("WebGLRenderer"))
    lazy.push({ file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
}
const report = {
  date: new Date().toISOString(),
  method:
    "Production HTML script references; gzip measured locally, not a field-performance or Lighthouse score.",
  initialJavaScriptGzipBytes: initial.reduce((s, f) => s + f.gzipBytes, 0),
  initialScripts: initial,
  lazyWebGLBundles: lazy,
};
await fs.mkdir("docs/implementation", { recursive: true });
await fs.writeFile(
  "docs/implementation/build-payload.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    initialJavaScriptGzipKiB: Math.round(
      report.initialJavaScriptGzipBytes / 1024,
    ),
    lazyWebGLGzipKiB: Math.round(
      lazy.reduce((s, f) => s + f.gzipBytes, 0) / 1024,
    ),
  }),
);
