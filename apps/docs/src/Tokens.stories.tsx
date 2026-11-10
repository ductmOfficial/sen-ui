import type { Meta, StoryObj } from "@storybook/react-vite";

const colors = [
  "bg",
  "surface",
  "surface-hover",
  "fg",
  "fg-muted",
  "border",
  "border-subtle",
  "accent",
  "accent-hover",
  "accent-text",
  "on-accent",
  "danger",
] as const;

function ColorTokens() {
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <caption style={{ textAlign: "start", fontWeight: 600, paddingBlock: "0.5rem" }}>
        Color tokens
      </caption>
      <thead>
        <tr>
          <th scope="col" style={{ textAlign: "start", paddingInline: "0.5rem" }}>
            Swatch
          </th>
          <th scope="col" style={{ textAlign: "start", paddingInline: "0.5rem" }}>
            Custom property
          </th>
        </tr>
      </thead>
      <tbody>
        {colors.map((name) => (
          <tr key={name}>
            <td style={{ padding: "0.25rem 0.5rem" }}>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  inlineSize: "2.5rem",
                  blockSize: "1.5rem",
                  borderRadius: "var(--sen-radius-sm)",
                  border: "1px solid var(--sen-color-border)",
                  backgroundColor: `var(--sen-color-${name})`,
                }}
              />
            </td>
            <td style={{ padding: "0.25rem 0.5rem", fontFamily: "var(--sen-font-family-mono)" }}>
              --sen-color-{name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta = {
  title: "Foundations/Tokens",
  component: ColorTokens,
} satisfies Meta<typeof ColorTokens>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {};

export const ColorsDark: Story = {
  globals: { theme: "dark" },
};
