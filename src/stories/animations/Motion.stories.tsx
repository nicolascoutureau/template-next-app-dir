import type { Meta, StoryObj } from "@storybook/react";
import { Motion } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Motion> = {
  title: "Animations/Motion",
  component: Motion,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    spring: {
      control: "select",
      options: ["smooth", "bouncy", "snappy", "gentle", "wobbly"],
    },
    anticipation: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    followThrough: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    squashStretch: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    secondaryMotion: { control: "boolean" },
    delay: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Motion>;

const Ball = () => (
  <div
    style={{
      width: 80,
      height: 80,
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      borderRadius: "50%",
      boxShadow: "0 10px 40px rgba(239, 68, 68, 0.4)",
    }}
  />
);

const Box = () => (
  <div
    style={{
      padding: "30px 50px",
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      borderRadius: 16,
      color: "white",
      fontSize: 20,
      fontWeight: 600,
      fontFamily: "system-ui",
      boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)",
    }}
  >
    Motion Element
  </div>
);

export const BasicEnter: Story = {
  args: {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "smooth",
  },
  render: (args) => (
    <Motion {...args}>
      <Box />
    </Motion>
  ),
};

export const WithAnticipation: Story = {
  args: {
    from: { y: 80, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "smooth",
    anticipation: 0.5,
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const WithFollowThrough: Story = {
  args: {
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "bouncy",
    followThrough: 0.4,
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const SquashAndStretch: Story = {
  args: {
    from: { y: 150, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "bouncy",
    squashStretch: 0.5,
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const FullPrinciples: Story = {
  args: {
    from: { y: 120, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "bouncy",
    anticipation: 0.3,
    followThrough: 0.4,
    squashStretch: 0.3,
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const ScaleIn: Story = {
  args: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    spring: "bouncy",
    squashStretch: 0.2,
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const SlideFromLeft: Story = {
  args: {
    from: { x: -150, opacity: 0 },
    to: { x: 0, opacity: 1 },
    spring: "snappy",
  },
  render: (args) => (
    <Motion {...args}>
      <Box />
    </Motion>
  ),
};

export const WithSecondaryMotion: Story = {
  args: {
    from: { y: 80, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "smooth",
    anticipation: 0.2,
    secondaryMotion: true,
  },
  render: (args) => (
    <Motion {...args}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Ball />
        <div
          style={{
            width: 40,
            height: 40,
            background: "#fbbf24",
            borderRadius: "50%",
          }}
        />
      </div>
    </Motion>
  ),
};

export const BouncySpring: Story = {
  args: {
    from: { y: 100, scale: 0.5, opacity: 0 },
    to: { y: 0, scale: 1, opacity: 1 },
    spring: "wobbly",
  },
  render: (args) => (
    <Motion {...args}>
      <Ball />
    </Motion>
  ),
};

export const DelayedEntry: Story = {
  args: {
    from: { y: 80, opacity: 0 },
    to: { y: 0, opacity: 1 },
    spring: "smooth",
    delay: 0.5,
  },
  render: (args) => (
    <Motion {...args}>
      <Box />
    </Motion>
  ),
};
