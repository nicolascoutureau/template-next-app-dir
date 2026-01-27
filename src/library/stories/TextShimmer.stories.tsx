import type { Meta, StoryObj } from "@storybook/react";
import { RemotionPreview } from "./RemotionPreview";
import { TextShimmer } from "../index";
import type { TextShimmerProps } from "../index";

const meta: Meta<TextShimmerProps> = {
  title: "Motion Library/Effects/TextShimmer",
  component: TextShimmer,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 120 } },
    shimmerWidth: { control: { type: "number", min: 5, max: 50 } },
    baseColor: { control: "color" },
    shimmerColor: { control: "color" },
    repeat: { control: { type: "number", min: 0, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<TextShimmerProps>;

export const Basic: Story = {
  args: {
    durationInFrames: 50,
    baseColor: "#64748b",
    shimmerColor: "#ffffff",
    shimmerWidth: 20,
    repeat: 1,
  },
  render: (args: TextShimmerProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-5xl font-bold">
        <TextShimmer {...args}>Shimmering Text</TextShimmer>
      </div>
    </RemotionPreview>
  ),
};

export const GoldShimmer: Story = {
  args: {
    durationInFrames: 60,
    baseColor: "#854d0e",
    shimmerColor: "#fbbf24",
    shimmerWidth: 25,
    repeat: 1,
  },
  render: (args: TextShimmerProps) => (
    <RemotionPreview durationInFrames={90}>
      <div className="text-5xl font-bold">
        <TextShimmer {...args}>Premium</TextShimmer>
      </div>
    </RemotionPreview>
  ),
};

export const InfiniteLoop: Story = {
  args: {
    durationInFrames: 40,
    baseColor: "#6366f1",
    shimmerColor: "#c7d2fe",
    shimmerWidth: 15,
    repeat: 0,
  },
  render: (args: TextShimmerProps) => (
    <RemotionPreview durationInFrames={180}>
      <div className="text-4xl font-semibold">
        <TextShimmer {...args}>Loading...</TextShimmer>
      </div>
    </RemotionPreview>
  ),
};

export const LargeHeadline: Story = {
  args: {
    durationInFrames: 70,
    baseColor: "#334155",
    shimmerColor: "#f1f5f9",
    shimmerWidth: 30,
    repeat: 1,
  },
  render: (args: TextShimmerProps) => (
    <RemotionPreview durationInFrames={120}>
      <div className="text-7xl font-black tracking-tight">
        <TextShimmer {...args}>LAUNCH</TextShimmer>
      </div>
    </RemotionPreview>
  ),
};
