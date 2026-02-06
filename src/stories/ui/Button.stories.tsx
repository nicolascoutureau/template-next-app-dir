import type { Meta, StoryObj } from "@storybook/react";
import { AbsoluteFill } from "remotion";
import { Button } from "../../remotion/library/components/ui/Button";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#f8fafc">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["glossy", "glass", "neon", "gradient", "soft", "outline", "solid", "pill", "rounded", "sharp"],
    },
    size: { control: { type: "select" }, options: ["xs", "sm", "md", "lg", "xl"] },
    color: { control: "color" },
    pressed: { control: "boolean" },
    hover: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: "glossy",
    size: "md",
    color: "#3b82f6",
    children: "Click Me",
  },
  render: (args) => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Button {...args} />
    </AbsoluteFill>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="glossy" color="#3b82f6">Glossy</Button>
        <Button variant="solid" color="#3b82f6">Solid</Button>
        <Button variant="gradient" color="#667eea" secondaryColor="#764ba2">Gradient</Button>
        <Button variant="pill" color="#3b82f6">Pill</Button>
        <Button variant="rounded" color="#3b82f6">Rounded</Button>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Button variant="outline" color="#3b82f6">Outline</Button>
        <Button variant="soft" color="#3b82f6">Soft</Button>
        <Button variant="sharp" color="#3b82f6">Sharp</Button>
      </div>
    </AbsoluteFill>
  ),
};

export const NeonButtons: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#0a0a0a">
        <Story />
      </RemotionWrapper>
    ),
  ],
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Button variant="neon" color="#00ff88">Accept</Button>
      <Button variant="neon" color="#ff0055">Decline</Button>
      <Button variant="neon" color="#00ccff">Info</Button>
    </AbsoluteFill>
  ),
};

export const GlassButtons: Story = {
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
        gap: 16,
      }}
    >
      <Button variant="glass" size="lg">Get Started</Button>
      <Button variant="glass" size="lg">Learn More</Button>
    </AbsoluteFill>
  ),
};

export const Sizes: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Button variant="glossy" color="#3b82f6" size="xs">XS</Button>
      <Button variant="glossy" color="#3b82f6" size="sm">Small</Button>
      <Button variant="glossy" color="#3b82f6" size="md">Medium</Button>
      <Button variant="glossy" color="#3b82f6" size="lg">Large</Button>
      <Button variant="glossy" color="#3b82f6" size="xl">XL Button</Button>
    </AbsoluteFill>
  ),
};

export const AnimatedEntrance: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Button variant="glossy" color="#3b82f6" animate animationType="fadeIn">Fade In</Button>
      <Button variant="glossy" color="#22c55e" animate animationType="scaleIn" delay={0.2}>Scale In</Button>
      <Button variant="glossy" color="#f59e0b" animate animationType="slideUp" delay={0.4}>Slide Up</Button>
      <Button variant="glossy" color="#ef4444" animate animationType="bounce" delay={0.6}>Bounce</Button>
    </AbsoluteFill>
  ),
};

export const States: Story = {
  render: () => (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Button variant="glossy" color="#3b82f6">Normal</Button>
      <Button variant="glossy" color="#3b82f6" hover>Hover</Button>
      <Button variant="glossy" color="#3b82f6" pressed>Pressed</Button>
      <Button variant="glossy" color="#3b82f6" disabled>Disabled</Button>
    </AbsoluteFill>
  ),
};
