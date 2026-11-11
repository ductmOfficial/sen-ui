// What an app ships when it imports Sen UI: for each component alone and for everything, the
// minified and gzipped JavaScript (Sen UI plus its runtime dependencies, without React), and the
// stylesheets. The last column keeps only three locales of React Aria's built-in strings, as an
// app does with @react-aria/optimize-locales-plugin. Measures the built package in dist/, so run
// `pnpm build` first.
// Usage: pnpm --filter @ductmofficial/sen-ui size
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { build } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const work = `${root}.size/`;
const components = [
  "Button",
  "TextField",
  "Checkbox",
  "Tooltip",
  "Tabs",
  "Dialog",
  "Select",
  "ComboBox",
  "DataTable",
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
const gzip = (text) => gzipSync(text, { level: 9 }).length;

async function measure(name, source, plugins = []) {
  const entry = `${work}${name}.js`;
  writeFileSync(entry, source);
  const output = await build({
    configFile: false,
    logLevel: "silent",
    plugins,
    build: {
      write: false,
      minify: true,
      lib: { entry, formats: ["es"], fileName: name },
      rolldownOptions: { external: [/^react(-dom)?($|\/)/] },
    },
  });
  const chunks = (Array.isArray(output) ? output : [output]).flatMap((result) => result.output);
  const code = chunks
    .filter((chunk) => chunk.type === "chunk")
    .map((chunk) => chunk.code)
    .join("\n");
  return { minified: Buffer.byteLength(code), gzipped: gzip(code) };
}

mkdirSync(work, { recursive: true });
try {
  const entries = [
    ...components.map((component) => [
      `\`${component}\``,
      component,
      `export { ${component} } from "../dist/index.js";\n`,
    ]),
    ["Everything", "all", `export * from "../dist/index.js";\n`],
  ];
  const locales = () => [optimizeLocales.vite({ locales: ["en-US", "de-DE", "vi-VN"] })];

  console.log("| Import | Minified | Gzipped | Gzipped, 3 locales |");
  console.log("| --- | ---: | ---: | ---: |");
  for (const [label, name, source] of entries) {
    const all = await measure(name, source);
    const trimmed = await measure(name, source, locales());
    console.log(`| ${label} | ${kb(all.minified)} | ${kb(all.gzipped)} | ${kb(trimmed.gzipped)} |`);
  }

  console.log("\n| Stylesheet | Minified | Gzipped |");
  console.log("| --- | ---: | ---: |");
  for (const file of ["styles.css", "tokens.css"]) {
    const css = readFileSync(`${root}dist/${file}`, "utf8");
    console.log(`| \`${file}\` | ${kb(Buffer.byteLength(css))} | ${kb(gzip(css))} |`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
