import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { DotGrid } from "../index";
import type { DotGridProps } from "../index";

const meta: Meta<DotGridProps> = {
  title: "Motion Library/Effects/DotGrid",
  component: DotGrid,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    spacing: { control: { type: "number", min: 10, max: 60 } },
    dotSize: { control: { type: "range", min: 1, max: 8, step: 0.5 } },
    dotColor: { control: "color" },
    dotOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    animation: {
      control: "select",
      options: ["wave", "radial", "rain", "none"],
    },
    durationInFrames: { control: { type: "number", min: 20, max: 120 } },
    loop: { control: "boolean" },
    centerX: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    centerY: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<DotGridProps>;

export const Wave: Story = {
  args: {
    width: 800,
    height: 450,
    spacing: 30,
    dotSize: 2,
    dotColor: "#3b82f6",
    dotOpacity: 0.5,
    animation: "wave",
    durationInFrames: 60,
    loop: true,
    centerX: 0.5,
    centerY: 0.5,
  },
  render: (args: DotGridProps) => (
    <RemotionPreview durationInFrames={120}>
      <DotGrid {...args} />
    </RemotionPreview>
  ),
};

export const Radial: Story = {
  args: {
    width: 800,
    height: 450,
    spacing: 25,
    dotSize: 3,
    dotColor: "#8b5cf6",
    dotOpacity: 0.6,
    animation: "radial",
    durationInFrames: 60,
    loop: true,
    centerX: 0.5,
    centerY: 0.5,
  },
  render: (args: DotGridProps) => (
    <RemotionPreview durationInFrames={120}>
      <DotGrid {...args} />
    </RemotionPreview>
  ),
};

export const Rain: Story = {
  args: {
    width: 800,
    height: 450,
    spacing: 20,
    dotSize: 2,
    dotColor: "#06b6d4",
    dotOpacity: 0.4,
    animation: "rain",
    durationInFrames: 90,
    loop: true,
  },
  render: (args: DotGridProps) => (
    <RemotionPreview durationInFrames={120}>
      <DotGrid {...args} />
    </RemotionPreview>
  ),
};
