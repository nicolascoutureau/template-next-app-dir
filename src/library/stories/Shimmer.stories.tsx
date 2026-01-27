import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RemotionPreview } from "./RemotionPreview";
import { Shimmer } from "../index";
import type { ShimmerProps } from "../index";

const meta: Meta<ShimmerProps> = {
  title: "Motion Library/Effects/Shimmer",
  component: Shimmer,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    startFrame: { control: { type: "number", min: 0, max: 60 } },
    durationInFrames: { control: { type: "number", min: 10, max: 120 } },
    shimmerWidth: { control: { type: "number", min: 20, max: 300 } },
    shimmerOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    shimmerColor: { control: "color" },
    angle: { control: { type: "number", min: 0, max: 360 } },
    repeat: { control: { type: "number", min: 1, max: 10 } },
    borderRadius: { control: { type: "number", min: 0, max: 32 } },
  },
};

export default meta;
type Story = StoryObj<ShimmerProps>;

export const Basic: Story = {
  args: {
    durationInFrames: 50,
    shimmerWidth: 120,
    shimmerOpacity: 0.4,
    shimmerColor: "#ffffff",
    angle: 120,
    repeat: 1,
    borderRadius: 16,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={120}>
      <Shimmer {...args}>
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-8 py-6 text-center">
          <div className="text-sm font-medium uppercase tracking-wider text-white/80">
            Introducing
          </div>
          <div className="mt-2 text-2xl font-bold text-white">Product Pro</div>
        </div>
      </Shimmer>
    </RemotionPreview>
  ),
};

export const Repeating: Story = {
  args: {
    durationInFrames: 40,
    repeat: 3,
    shimmerWidth: 80,
    shimmerColor: "#fbbf24",
    angle: 135,
    borderRadius: 12,
  },
  render: (args) => (
    <RemotionPreview durationInFrames={180}>
      <Shimmer {...args}>
        <div className="rounded-xl bg-slate-800 px-6 py-4 text-white">
          <div className="text-lg font-semibold">Premium Feature</div>
          <div className="text-sm text-slate-400">Unlock now</div>
        </div>
      </Shimmer>
    </RemotionPreview>
  ),
};
