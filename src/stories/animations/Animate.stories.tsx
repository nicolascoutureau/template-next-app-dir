import type { Meta, StoryObj } from "@storybook/react";
import { Animate } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Animate> = {
  title: "Animations/Animate",
  component: Animate,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    duration: { control: { type: "range", min: 0.2, max: 2, step: 0.1 } },
    delay: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    ease: { control: "select", options: ["smooth", "bouncy", "snappy", "gentle", "appleSwift", "elastic"] },
  },
};

export default meta;
type Story = StoryObj<typeof Animate>;

const Box = ({ color = "#667eea" }: { color?: string }) => (
  <div
    style={{
      width: 120,
      height: 120,
      background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "system-ui",
      boxShadow: `0 10px 40px ${color}66`,
    }}
  >
    Animate
  </div>
);

export const FadeIn: Story = {
  args: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 0.5,
  },
  render: (args) => (
    <Animate {...args}>
      <Box />
    </Animate>
  ),
};

export const SlideUp: Story = {
  args: {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.6,
    ease: "smooth",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#22c55e" />
    </Animate>
  ),
};

export const SlideFromLeft: Story = {
  args: {
    from: { x: -150, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 0.5,
    ease: "snappy",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#f59e0b" />
    </Animate>
  ),
};

export const ScaleUp: Story = {
  args: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 0.5,
    ease: "bouncy",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#ef4444" />
    </Animate>
  ),
};

export const RotateIn: Story = {
  args: {
    from: { rotate: -180, opacity: 0, scale: 0.5 },
    to: { rotate: 0, opacity: 1, scale: 1 },
    duration: 0.8,
    ease: "smooth",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#8b5cf6" />
    </Animate>
  ),
};

export const WithBlur: Story = {
  args: {
    from: { opacity: 0, blur: 20, y: 30 },
    to: { opacity: 1, blur: 0, y: 0 },
    duration: 0.7,
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#06b6d4" />
    </Animate>
  ),
};

export const SpringAnimation: Story = {
  args: {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "bouncy",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#ec4899" />
    </Animate>
  ),
};

export const ComplexAnimation: Story = {
  args: {
    from: { x: -100, y: 50, scale: 0.5, rotate: -45, opacity: 0 },
    to: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
    duration: 1,
    ease: "smooth",
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#14b8a6" />
    </Animate>
  ),
};

export const DelayedAnimation: Story = {
  args: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.5,
    delay: 0.5,
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#a855f7" />
    </Animate>
  ),
};

export const SkewAnimation: Story = {
  args: {
    from: { skewX: 20, opacity: 0 },
    to: { skewX: 0, opacity: 1 },
    duration: 0.6,
  },
  render: (args) => (
    <Animate {...args}>
      <Box color="#f97316" />
    </Animate>
  ),
};
