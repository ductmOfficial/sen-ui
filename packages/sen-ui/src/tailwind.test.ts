// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { compile } from "@tailwindcss/node";
import { describe, expect, it } from "vitest";

const src = new URL("./", import.meta.url);
const theme = readFileSync(new URL("tailwind.css", src), "utf8");
const tokens = readFileSync(new URL("tokens.css", src), "utf8");

describe("Tailwind theme", () => {
  it("only references tokens that exist", () => {
    const defined = new Set([...tokens.matchAll(/(--sen-[\w-]+):/g)].map((m) => m[1]));
    const referenced = [...theme.matchAll(/var\((--sen-[\w-]+)\)/g)].map((m) => m[1]);
    expect(referenced.length).toBeGreaterThan(0);
    for (const name of referenced) expect(defined).toContain(name);
  });

  it("maps every color token", () => {
    const colors = [...tokens.matchAll(/--sen-color-([\w-]+):/g)].map((m) => m[1]);
    for (const color of new Set(colors)) expect(theme).toContain(`--color-sen-${color ?? ""}:`);
  });

  it("generates utilities that read the tokens at runtime", async () => {
    const compiler = await compile(
      '@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities);\n@import "./tailwind.css";',
      { base: fileURLToPath(src), onDependency: () => undefined },
    );
    const css = compiler.build([
      "bg-sen-bg",
      "text-sen-fg",
      "border-sen-border",
      "rounded-sen-md",
      "font-sen",
    ]);
    expect(css).toContain("background-color: var(--sen-color-bg)");
    expect(css).toContain("color: var(--sen-color-fg)");
    expect(css).toContain("border-color: var(--sen-color-border)");
    expect(css).toContain("border-radius: var(--sen-radius-md)");
    expect(css).toContain("font-family: var(--sen-font-family)");
  });
});
