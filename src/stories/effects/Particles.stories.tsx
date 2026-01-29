import type { Meta, StoryObj } from "@storybook/react";
import { Particles } from "../../remotion/base/components/effects";
import { RemotionWrapper } from "../helpers/RemotionWrapper";

const meta: Meta<typeof Particles> = {
  title: "Effects/Particles",
  component: Particles,
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#0f0f23">
        <div style={{ width: 600, height: 400, position: "relative" }}>
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  argTypes: {
    count: { control: { type: "range", min: 10, max: 100, step: 5 } },
    behavior: { control: "select", options: ["float", "confetti", "snow", "sparkle", "rise"] },
    shape: { control: "select", options: ["circle", "square", "star"] },
    speed: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Particles>;

export const Float: Story = {
  args: {
    count: 30,
    behavior: "float",
    colors: ["#667eea", "#764ba2", "#f59e0b"],
  },
  render: (args) => <Particles {...args} />,
};

export const Confetti: Story = {
  args: {
    count: 50,
    behavior: "confetti",
    colors: ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"],
    shape: "square",
  },
  render: (args) => <Particles {...args} />,
};

export const Snow: Story = {
  decorators: [
    (Story) => (
      <RemotionWrapper durationInFrames={300} backgroundColor="#1e3a5f">
        <div style={{ width: 600, height: 400, position: "relative" }}>
          <Story />
        </div>
      </RemotionWrapper>
    ),
  ],
  args: {
    count: 60,
    behavior: "snow",
    colors: ["#ffffff", "#e0e7ff"],
    speed: 0.8,
  },
  render: (args) => <Particles {...args} />,
};

export const Sparkle: Story = {
  args: {
    count: 40,
    behavior: "sparkle",
    colors: ["#fcd34d", "#fbbf24", "#f59e0b"],
    shape: "star",
  },
  render: (args) => <Particles {...args} />,
};

export const Rise: Story = {
  args: {
    count: 25,
    behavior: "rise",
    colors: ["#f87171", "#fb923c", "#fbbf24"],
  },
  render: (args) => <Particles {...args} />,
};
