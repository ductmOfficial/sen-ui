// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const src = new URL("./", import.meta.url);
const tokens = new Set(
  [...readFileSync(new URL("tokens.css", src), "utf8").matchAll(/(--sen-[\w-]+):/g)].map(
    (m) => m[1],
  ),
);
const modules = readdirSync(src).filter((file) => file.endsWith(".module.css"));

describe("component styles", () => {
  it.each(modules)("%s only falls back to tokens that exist", (file) => {
    const css = readFileSync(new URL(file, src), "utf8");
    // Every var() either names a token or a component override that falls back to a token.
    const references = [...css.matchAll(/var\((--sen-[\w-]+)(?:,\s*var\((--sen-[\w-]+)\))?\)/g)];
    expect(references.length).toBeGreaterThan(0);
    for (const [, name = "", fallback] of references) {
      const token = fallback ?? name;
      expect(tokens, `${file}: ${token}`).toContain(token);
    }
  });

  it.each(modules)("%s has no hard-coded colors", (file) => {
    const css = readFileSync(new URL(file, src), "utf8");
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});
