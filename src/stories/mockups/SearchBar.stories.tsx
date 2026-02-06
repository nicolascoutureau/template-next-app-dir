import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { SearchBar } from "../../remotion/library/components/mockups/SearchBar";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof SearchBar> = {
  title: "Mockups/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    variant: { control: { type: "select" }, options: ["default", "pill", "minimal", "glass"] },
    width: { control: { type: "range", min: 200, max: 500, step: 10 } },
    focused: { control: "boolean" },
    animate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    width: 320,
  },
  render: (args) => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SearchBar {...args} />
    </AbsoluteFill>
  ),
};

export const PillVariant: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SearchBar variant="pill" placeholder="Search products..." width={360} />
    </AbsoluteFill>
  ),
};

export const MinimalVariant: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SearchBar variant="minimal" placeholder="Type to search" width={300} />
    </AbsoluteFill>
  ),
};

export const GlassVariant: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SearchBar variant="glass" placeholder="Search..." width={340} />
    </AbsoluteFill>
  ),
};

export const WithValue: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SearchBar variant="default" value="remotion components" width={360} focused />
    </AbsoluteFill>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <SearchBar variant="default" placeholder="Default" width={300} />
      <SearchBar variant="pill" placeholder="Pill" width={300} />
      <SearchBar variant="minimal" placeholder="Minimal" width={300} />
    </AbsoluteFill>
  ),
};
