// @vitest-environment node
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

/** Custom properties declared in the first block whose selector ends with `selector {`. */
function block(selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No block for ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  const entries: [string, string][] = [];
  for (const [, name = "", value = ""] of body.matchAll(/(--sen-[\w-]+):\s*([^;]+);/g)) {
    entries.push([name, value.trim()]);
  }
  return new Map(entries);
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const light = block('[data-theme="light"]');
const darkForced = block('[data-theme="dark"]');
const darkSystem = block(':root:not([data-theme="light"])');

// [foreground, background, minimum ratio]: 4.5 for text (WCAG 1.4.3), 3 for UI parts (1.4.11).
const pairs: [string, string, number][] = [
  ["fg", "bg", 4.5],
  ["fg", "surface", 4.5],
  ["fg", "surface-hover", 4.5],
  ["fg-muted", "bg", 4.5],
  ["fg-muted", "surface", 4.5],
  ["accent-text", "bg", 4.5],
  ["danger", "bg", 4.5],
  ["on-accent", "accent", 4.5],
  ["on-accent", "accent-hover", 4.5],
  ["border", "bg", 3],
  ["accent", "bg", 3],
];

function color(theme: Map<string, string>, name: string): string {
  const token = name === "focus-ring" ? "--sen-focus-ring-color" : `--sen-color-${name}`;
  const value = theme.get(token);
  if (!value?.startsWith("#")) throw new Error(`${token} is not a hex color`);
  return value;
}

describe("design tokens", () => {
  it("defines the same color tokens in the light and dark themes", () => {
    expect([...darkForced.keys()].sort()).toEqual([...light.keys()].sort());
  });

  it("uses the same values for the system dark theme and data-theme='dark'", () => {
    expect(darkSystem).toEqual(darkForced);
  });

  describe.each([
    ["light", light],
    ["dark", darkForced],
  ] as const)("%s theme", (_, theme) => {
    it.each(pairs)("%s on %s meets %d:1", (fg, bg, minimum) => {
      expect(contrast(color(theme, fg), color(theme, bg))).toBeGreaterThanOrEqual(minimum);
    });

    it("focus ring meets 3:1 against bg", () => {
      expect(contrast(color(theme, "focus-ring"), color(theme, "bg"))).toBeGreaterThanOrEqual(3);
    });
  });
});
