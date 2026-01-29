import type { Meta, StoryObj } from "@storybook/react";
import { Rotate, Spin } from "../../remotion/base/components/animations";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Rotate> = {
  title: "Animations/Rotate",
  component: Rotate,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={120} backgroundColor="#1a1a2e">
        <Story />
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    from: { control: { type: "range", min: -360, max: 360, step: 15 } },
    to: { control: { type: "range", min: -360, max: 360, step: 15 } },
    axis: { control: "select", options: ["z", "x", "y"] },
    duration: { control: { type: "range", min: 0.3, max: 2, step: 0.1 } },
    fade: { control: "boolean" },
    scale: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Rotate>;

const Box = () => (
  <div
    style={{
      width: 120,
      height: 120,
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: 32,
      fontWeight: 700,
      boxShadow: "0 10px 40px rgba(245, 158, 11, 0.4)",
    }}
  >
    R
  </div>
);

export const Default: Story = {
  args: {
    from: -180,
    to: 0,
    duration: 0.6,
  },
  render: (args) => (
    <Rotate {...args}>
      <Box />
    </Rotate>
  ),
};

export const FullRotation: Story = {
  args: {
    from: 360,
    to: 0,
    duration: 0.8,
  },
  render: (args) => (
    <Rotate {...args}>
      <Box />
    </Rotate>
  ),
};

export const RotateX: Story = {
  args: {
    from: 90,
    to: 0,
    axis: "x",
    duration: 0.6,
    perspective: 800,
  },
  render: (args) => (
    <Rotate {...args}>
      <Box />
    </Rotate>
  ),
};

export const RotateY: Story = {
  args: {
    from: -90,
    to: 0,
    axis: "y",
    duration: 0.6,
    perspective: 800,
  },
  render: (args) => (
    <Rotate {...args}>
      <Box />
    </Rotate>
  ),
};

export const WithFadeAndScale: Story = {
  args: {
    from: -180,
    to: 0,
    duration: 0.8,
    fade: true,
    scale: true,
  },
  render: (args) => (
    <Rotate {...args}>
      <Box />
    </Rotate>
  ),
};

export const ContinuousSpin: Story = {
  render: () => (
    <Spin speed={1} direction="clockwise">
      <Box />
    </Spin>
  ),
};

export const SlowSpin: Story = {
  render: () => (
    <Spin speed={0.3} direction="counterclockwise">
      <Box />
    </Spin>
  ),
};
