import type { Meta, StoryObj } from "@storybook/react";
import { SoftGradient } from "../../remotion/base/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof SoftGradient> = {
  title: "Effects/SoftGradient",
  component: SoftGradient,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#000">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    speed: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    blur: { control: { type: "range", min: 40, max: 150, step: 10 } },
    opacity: { control: { type: "range", min: 0.3, max: 1, step: 0.1 } },
    blobCount: { control: { type: "range", min: 2, max: 8, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof SoftGradient>;

const CenteredContent = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      color: "white",
      fontSize: 36,
      fontWeight: 700,
      fontFamily: "system-ui",
      textShadow: "0 2px 20px rgba(0,0,0,0.3)",
    }}
  >
    {children}
  </div>
);

export const Default: Story = {
  args: {
    colors: ["#667eea", "#764ba2"],
    speed: 0.3,
    blur: 80,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Soft Gradient</CenteredContent>
    </SoftGradient>
  ),
};

export const Sunset: Story = {
  args: {
    colors: ["#ff7e5f", "#feb47b", "#ff6b6b"],
    speed: 0.25,
    blur: 100,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Sunset</CenteredContent>
    </SoftGradient>
  ),
};

export const Ocean: Story = {
  args: {
    colors: ["#0077b6", "#00b4d8", "#90e0ef"],
    speed: 0.2,
    blur: 90,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Ocean</CenteredContent>
    </SoftGradient>
  ),
};

export const Neon: Story = {
  args: {
    colors: ["#ff00ff", "#00ffff", "#ff00ff"],
    speed: 0.4,
    blur: 70,
    opacity: 0.9,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Neon</CenteredContent>
    </SoftGradient>
  ),
};

export const MultiColor: Story = {
  args: {
    colors: ["#ff0080", "#7928ca", "#0070f3", "#00dfd8"],
    speed: 0.35,
    blur: 80,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Multi Color</CenteredContent>
    </SoftGradient>
  ),
};

export const Pastel: Story = {
  args: {
    colors: ["#ffecd2", "#fcb69f", "#a1c4fd", "#c2e9fb"],
    speed: 0.2,
    blur: 100,
    opacity: 0.7,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#374151",
          fontSize: 36,
          fontWeight: 700,
          fontFamily: "system-ui",
        }}
      >
        Pastel
      </div>
    </SoftGradient>
  ),
};

export const DarkTheme: Story = {
  args: {
    colors: ["#0f0f23", "#1a1a3e", "#2d2d5a", "#4a4a7a"],
    speed: 0.15,
    blur: 90,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Dark Theme</CenteredContent>
    </SoftGradient>
  ),
};

export const MoreBlobs: Story = {
  args: {
    colors: ["#667eea", "#764ba2", "#f59e0b"],
    speed: 0.3,
    blur: 80,
    blobCount: 6,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>6 Blobs</CenteredContent>
    </SoftGradient>
  ),
};

export const FastAnimation: Story = {
  args: {
    colors: ["#ec4899", "#8b5cf6", "#3b82f6"],
    speed: 0.8,
    blur: 70,
  },
  render: (args) => (
    <SoftGradient {...args}>
      <CenteredContent>Fast</CenteredContent>
    </SoftGradient>
  ),
};
