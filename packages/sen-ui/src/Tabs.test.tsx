import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tab, TabList, TabPanel, Tabs, type TabsProps } from "./Tabs.js";

function Settings(props: Omit<TabsProps, "children">) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Settings">
        <Tab id="profile">Profile</Tab>
        <Tab id="security">Security</Tab>
        <Tab id="billing" isDisabled>
          Billing
        </Tab>
        <Tab id="notifications">Notifications</Tab>
      </TabList>
      <TabPanel id="profile">Profile settings</TabPanel>
      <TabPanel id="security">Security settings</TabPanel>
      <TabPanel id="billing">Billing settings</TabPanel>
      <TabPanel id="notifications">Notification settings</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the first tab's panel and links tab and panel", () => {
    render(<Settings />);
    const tab = screen.getByRole("tab", { name: "Profile" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Profile settings");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAccessibleName("Profile");
  });

  it("keeps a single tab stop on the selected tab", async () => {
    render(<Settings defaultSelectedKey="security" />);
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus();
  });

  it("moves selection with the arrow keys, skipping disabled tabs", async () => {
    render(<Settings />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Notifications" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Notification settings");
  });

  it("jumps to the ends with Home and End", async () => {
    render(<Settings />);
    await userEvent.tab();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Notifications" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
  });

  it("waits for Enter or Space with manual activation", async () => {
    render(<Settings keyboardActivation="manual" />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
  });

  it("can be controlled", async () => {
    const onSelectionChange = vi.fn();
    render(<Settings selectedKey="profile" onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Security" }));
    expect(onSelectionChange).toHaveBeenCalledWith("security");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
  });

  it("supports a vertical tab list", () => {
    render(<Settings orientation="vertical" />);
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });
});
